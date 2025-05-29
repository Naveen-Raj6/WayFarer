import Stripe from 'stripe';
import User from '../models/user.model.js';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


export let subscriptionWebHook = async (req, res) => {
    let event;

    try {
        const sig = req.headers['stripe-signature'];
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        console.log('Event Type:', event.type);
    } catch (err) {
        console.error('⚠️ Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log('Session data:', session);

            // Get subscription details
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            console.log('Subscription data:', subscription);

            // Find and update user
            const updatedUser = await User.findOneAndUpdate(
                { email: session.customer_email },
                {
                    stripeCustomerId: session.customer,
                    subscriptionId: subscription.id,
                    subscriptionStatus: subscription.status,
                    isSubscribed: true,
                    currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000)
                },
                { new: true }
            );

            console.log('Updated user:', updatedUser);

            if (!updatedUser) {
                console.error('User not found:', session.customer_email);
            }
        }

        return res.status(200).json({ received: true });
    } catch (err) {
        console.error('Error processing webhook:', err);
        return res.status(400).json({ received: false });
    }
}