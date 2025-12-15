import User from '../models/User.js';
import { createRazorpaySubscription } from '../services/razorpay.js';
import { AppError } from '../utils/error.js';

export const createSubscription = async (req, res, next) => {
  try {
    const { username, email, phone, description } = req.body;

    console.log('Creating subscription for:', { username, email, phone });

    const existingUser = await User.findOne({ phone });
    
    if (existingUser) {
      if (existingUser.subscriptionStatus === 'active') {
        console.log('User already has active subscription with phone:', phone);
        throw new AppError('Phone number already has an active subscription. Please use a different number or contact support.', 409);
      }
      
      if (existingUser.subscriptionStatus === 'cancelled' || existingUser.subscriptionStatus === 'paused' || existingUser.subscriptionStatus === 'expired') {
        console.log('User has cancelled/paused subscription. Will reactivate on payment:', phone);
        
        const subscription = await createRazorpaySubscription({
          username: existingUser.username,
          email: existingUser.email,
          phone: existingUser.phone,
          description: description || existingUser.description,
        });

        await User.findByIdAndUpdate(existingUser._id, {
          subscriptionId: subscription.id,
          razorpayCustomerId: subscription.customer_id,
          description: description || existingUser.description,
          subscriptionStatus: 'pending',
          nextBillingDate: subscription.userData.nextBillingDate,
        });

        console.log('Subscription created for existing user. Status will update to active on payment.');

        return res.status(200).json({
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
      }
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
}; async (req, res, next) => {
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

export const getSubscriptionDetails = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;

    console.log('Fetching subscription details for:', subscriptionId);

    const user = await User.findOne({ subscriptionId }).select('-__v -description');

    if (!user) {
      throw new AppError('Subscription not found. Please wait a moment for payment confirmation.', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        username: user.username,
        email: user.email,
        phone: user.phone,
        subscriptionId: user.subscriptionId,
        subscriptionStatus: user.subscriptionStatus,
        startDate: user.startDate,
        nextBillingDate: user.nextBillingDate,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get subscription error:', error.message);
    next(error);
  }
};

export const syncSubscriptionStatus = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;

    console.log('Syncing subscription status for:', subscriptionId);

    const Razorpay = (await import('razorpay')).default;
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const subscription = await razorpay.subscriptions.fetch(subscriptionId);
    
    const statusMap = {
      'created': 'active',
      'authenticated': 'active',
      'active': 'active',
      'pending': 'active',
      'halted': 'cancelled',
      'cancelled': 'cancelled',
      'completed': 'expired',
      'expired': 'expired',
      'paused': 'paused',
    };

    const newStatus = statusMap[subscription.status] || 'active';

    const user = await User.findOneAndUpdate(
      { subscriptionId },
      { subscriptionStatus: newStatus },
      { new: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    console.log(`Updated subscription status from Razorpay: ${subscription.status} -> ${newStatus}`);

    res.status(200).json({
      success: true,
      message: 'Subscription status synced successfully',
      data: {
        razorpayStatus: subscription.status,
        dbStatus: newStatus,
        username: user.username,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Sync subscription error:', error.message);
    next(error);
  }
};