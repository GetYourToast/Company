import express from 'express';
import { createSubscription, getSubscriptionDetails, syncSubscriptionStatus } from '../controllers/subscriptionController.js';
import { validateSubscription } from '../middleware/validation.js';

const router = express.Router();

router.post('/create', validateSubscription, createSubscription);
router.get('/details/:subscriptionId', getSubscriptionDetails);
router.post('/sync/:subscriptionId', syncSubscriptionStatus);

export default router;