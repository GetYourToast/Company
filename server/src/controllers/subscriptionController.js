import { createRazorpaySubscription } from '../services/razorpay.js';
import { AppError } from '../utils/error.js';

export const createSubscription = async (req, res, next) => {
  try {
    const { username, email, phone, description } = req.body;

    if (!username || !email || !phone || !description) {
      throw new AppError('Missing required fields', 400);
    }

    const subscription = await createRazorpaySubscription({
      username,
      email,
      phone,
      description,
    });

    return res.status(200).json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        razorpayKey: subscription.razorpay_key_id,
        amount: subscription.plan.item.amount,
        currency: subscription.plan.item.currency,
        customerNotify: subscription.customer_notify,
      },
    });
  } catch (error) {
    next(error);
  }
};
