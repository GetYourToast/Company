import express from 'express';
import { handleRazorpayWebhook } from '../controllers/webhookController.js';
import { verifyRazorpaySignature } from '../middleware/razorpay.js';

const router = express.Router();

router.post('/razorpay', express.raw({ type: 'application/json' }), verifyRazorpaySignature, handleRazorpayWebhook);

export default router;