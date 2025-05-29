import Stripe from 'stripe';
import User from '../models/user.model.js';
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


export let createCheckoutSession = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Verify STRIPE_PRICE_ID exists
        if (!process.env.STRIPE_PRICE_ID) {
            console.error('Missing STRIPE_PRICE_ID in environment variables');
            return res.status(500).json({ error: 'Subscription configuration error' });
        }

        // Check if Stripe customer already exists
        let customerId = user.stripeCustomerId;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.username,
            });
            user.stripeCustomerId = customer.id;
            await user.save();
            customerId = customer.id;
        }

        // Create the checkout session for a subscription
        const session = await stripe.checkout.sessions.create({
            customer_email: user.email,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/home`,
            metadata: {
                userId: user._id.toString(),
            },
            allow_promotion_codes: true,
            billing_address_collection: 'required',
            expand: ['subscription']
        });

        res.json({ url: session.url });
    } catch (err) {
        console.error('Stripe checkout error:', err);
        res.status(500).json({ error: 'Something went wrong creating Stripe session.' });
    }
}


export let cancelSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user || !user.subscriptionId) {
            return res.status(400).json({ error: 'No active subscription found' });
        }

        // Cancel the subscription at period end
        await stripe.subscriptions.update(user.subscriptionId, {
            cancel_at_period_end: true
        });

        // Update user in database
        await User.findByIdAndUpdate(req.userId, {
            subscriptionStatus: 'canceled',
            isSubscribed: false
        });

        res.json({ success: true, message: 'Subscription canceled successfully' });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        res.status(500).json({ error: 'Failed to cancel subscription' });
    }
}

export let handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed.', err);
        return res.status(401).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const subscription = session.subscription;

            // Update the user in the database
            const updatedUser = await User.findOneAndUpdate(
                { email: session.customer_email },
                {
                    stripeCustomerId: session.customer,
                    subscriptionId: subscription.id,
                    subscriptionStatus: subscription.status,
                    isSubscribed: true, // <--- THIS LINE
                    currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000)
                },
                { new: true }
            );

            console.log('User updated:', updatedUser);
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
}