import express from 'express';
import { createSubscription , checkSubscriptionUser,  updateUserInfo} from '../controllers/subscriptionController.js';

const router = express.Router();

router.post('/create', createSubscription);
router.get('/details/:subscriptionId', checkSubscriptionUser);
router.put('/update-user', updateUserInfo);


export default router;
