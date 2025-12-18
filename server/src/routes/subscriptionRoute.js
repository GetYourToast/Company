import express from 'express';
import { createSubscription , checkSubscriptionUser} from '../controllers/subscriptionController.js';

const router = express.Router();

router.post('/create', createSubscription);
router.get('/details/:subscriptionId', checkSubscriptionUser);


export default router;
