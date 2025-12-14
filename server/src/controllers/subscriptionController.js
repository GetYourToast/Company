import User from '../models/User.js';
import { createRazorpaySubscription } from '../services/razorpay.js';
import { AppError } from '../utils/error.js';

export const createSubscription = async (req, res, next) => {
  try {
    const { username, email, phone, description } = req.body;

    console.log('Creating subscription for:', { username, email, phone });

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      console.log('User already exists with phone:', phone);
      throw new AppError('Phone number already registered. Please use a different number or contact support.', 409);
    }

    const subscription = await createRazorpaySubscription({
      username,
      email,
      phone,
      description,
    });

    console.log('Subscription created successfully:', subscription.id);

    res.status(200).json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        razorpayKey: subscription.razorpay_key_id,
        amount: subscription.plan.item.amount,
        currency: subscription.plan.item.currency,
        customerNotify: subscription.customer_notify,
        userData: subscription.userData,
      },
    });
  } catch (error) {
    console.error('Subscription controller error:', error.message);
    
    if (error.statusCode === 409) {
      return next(error);
    }

    if (error.message && error.message.includes('already exists')) {
      return next(new AppError('This email is already registered with another subscription. Please use a different email.', 409));
    }

    next(error);
  }
};