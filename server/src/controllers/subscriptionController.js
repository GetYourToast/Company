import User from '../models/User.js';
import Razorpay from 'razorpay';
import config from '../config/config.js';
import { createRazorpaySubscription } from '../services/razorpay.js';
import { AppError } from '../utils/error.js';
import { sendWhatsAppMessage } from '../services/whatsapp.js';
import { generateWelcomeMessage } from '../services/gemini.js';

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

const reconstructDescription = notes => {
  if (notes.description) return notes.description;
  const chunks = [];
  let i = 0;
  while (notes[`desc_${i}`]) {
    chunks.push(notes[`desc_${i}`]);
    i++;
  }
  return chunks.join('');
};

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
        amount: process.env.SUBSCRIPTION_AMOUNT,
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

    let user = await User.findOne({ subscriptionId }).select(
      'username email phone subscriptionStatus nextBillingDate trialEndsAt'
    );

    if (user) {
      return res.status(200).json({ success: true, data: user });
    }

    const subscription = await razorpay.subscriptions.fetch(subscriptionId);
    const notes = subscription.notes || {};
    const description = reconstructDescription(notes);

    if (subscription.status !== 'authenticated' && subscription.status !== 'active') {
      return res.status(200).json({
        success: false,
        status: 'pending',
      });
    }

    const trialEndsAt = subscription.start_at
      ? new Date(subscription.start_at * 1000)
      : null;

    const now = new Date();
    const status = trialEndsAt && now < trialEndsAt ? 'trial' : 'active';

    user = await User.findOne({ phone: notes.phone });

    if (!user) {
      user = new User({
        username: notes.username,
        email: notes.email,
        phone: notes.phone,
        description,
      });
    }

    user.subscriptionId = subscription.id;
    user.razorpayCustomerId = subscription.customer_id;
    user.subscriptionStatus = status;
    user.trialEndsAt = trialEndsAt;
    user.nextBillingDate = trialEndsAt;
    user.startDate = new Date(notes.serviceStartDate);
    user.hasUsedTrial = true;
    user.cancelAtPeriodEnd = false;

    await user.save();

    if (!user.welcomeMessageSent) {
      sendWelcomeMessageAsync(user);
    }

    res.status(200).json({
      success: true,
      data: {
        username: user.username,
        email: user.email,
        phone: user.phone,
        subscriptionStatus: user.subscriptionStatus,
        nextBillingDate: user.nextBillingDate,
        trialEndsAt: user.trialEndsAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

async function sendWelcomeMessageAsync(user) {
  try {
    const message = await generateWelcomeMessage(user.username, user.description);
    await sendWhatsAppMessage(user.phone, message);
    user.welcomeMessageSent = true;
    await user.save();
  } catch {}
}

export const updateUserInfo = async (req, res, next) => {
  try {
    const { username, email, phone, description } = req.body;

    if (!username || !email || !phone || !description) {
      throw new AppError('Missing required fields', 400);
    }

 
    const user = await User.findOne({ phone });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.username = username;
    user.email = email;
    user.description = description;
    

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User information updated successfully',
      data: {
        username: user.username,
        email: user.email,
        phone: user.phone,
        description: user.description,
      },
    });
  } catch (error) {
    next(error);
  }
};
