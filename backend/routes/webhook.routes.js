import express from 'express';
import { subscriptionWebHook } from '../controllers/webhook.controllers.js';
const router = express.Router();


router.post('/', express.raw({ type: 'application/json' }), subscriptionWebHook);

export default router;