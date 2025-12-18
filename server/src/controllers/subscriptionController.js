import User from '../models/User.js';
import { createRazorpaySubscription } from '../services/razorpay.js';
import { AppError } from '../utils/error.js';

export const createSubscription = async (req, res, next) => {
  try {
    const { username, email, phone, description } = req.body;

    if (!username || !email || !phone || !description) {
      throw new AppError('Missing required fields', 400);
    }

    const existingUser = await User.findOne({ phone });
    const skipTrial = existingUser?.hasUsedTrial === true;

    const subscription = await createRazorpaySubscription({
      username,
      email,
      phone,
      description,
      skipTrial,
    });

    res.status(200).json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        razorpayKey: subscription.razorpay_key_id,
        aamount: process.env.SUBSCRIPTION_AMOUNT,
        currency: 'INR',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const checkSubscriptionUser = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;

    const user = await User.findOne({ subscriptionId }).select(
      'username email phone subscriptionStatus nextBillingDate'
    );

    if (!user) {
      return res.status(404).json({ success: false });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
