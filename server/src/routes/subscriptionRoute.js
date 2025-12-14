import express from 'express';
import { createSubscription } from '../controllers/subscriptionController.js';
import { validateSubscription } from '../middleware/validation.js';

const router = express.Router();

router.post('/create', validateSubscription, createSubscription);

export default router;