import express from 'express';

import auth from '../middlewares/auth.js';
import { cancelSubscription, createCheckoutSession } from '../controllers/stripe.controllers.js';


const router = express.Router();


router.post('/create-checkout-session', auth, createCheckoutSession);

router.post('/cancel-subscription', auth, cancelSubscription);

export default router;