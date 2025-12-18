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
  // First try to get full description if it exists
  if (notes.description) {
    return notes.description;
  }
  
  // Otherwise reconstruct from chunks
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

    // First check if user exists in database
    let user = await User.findOne({ subscriptionId }).select(
      'username email phone subscriptionStatus nextBillingDate trialEndsAt'
    );

    if (user) {
      return res.status(200).json({ success: true, data: user });
    }

    // User not in DB yet - fetch from Razorpay and create immediately
    console.log('🔍 User not found in DB, fetching from Razorpay:', subscriptionId);

    try {
      const subscription = await razorpay.subscriptions.fetch(subscriptionId);
      const notes = subscription.notes || {};
      const description = reconstructDescription(notes);

      console.log('📋 Razorpay subscription status:', subscription.status);
      console.log('📝 Notes from Razorpay:', notes);
      console.log('📄 Reconstructed description:', description || 'EMPTY');

      // If subscription is authenticated (UPI autopay set up) or active, create user NOW
      if (subscription.status === 'authenticated' || subscription.status === 'active') {
        const trialEndsAt = subscription.start_at
          ? new Date(subscription.start_at * 1000)
          : null;

        const now = new Date();
        const status = trialEndsAt && now < trialEndsAt ? 'trial' : 'active';

        // Check if user exists by phone
        user = await User.findOne({ phone: notes.phone });

        if (!user) {
          // Validate required fields before creating user
          if (!notes.username || !notes.email || !notes.phone || !description) {
            console.error('❌ Missing required fields:', {
              username: !!notes.username,
              email: !!notes.email,
              phone: !!notes.phone,
              description: !!description
            });
            
            return res.status(400).json({
              success: false,
              message: 'Missing required user information in subscription'
            });
          }

          user = new User({
            username: notes.username,
            email: notes.email,
            phone: notes.phone,
            description: description,
          });
          console.log('✨ Creating new user for phone:', notes.phone);
        } else {
          console.log('📝 Updating existing user for phone:', notes.phone);
        }

        // Update/set subscription details
        user.subscriptionId = subscription.id;
        user.razorpayCustomerId = subscription.customer_id;
        user.subscriptionStatus = status;
        user.trialEndsAt = trialEndsAt;
        user.startDate = new Date(notes.serviceStartDate);
        user.nextBillingDate = new Date(subscription.current_end * 1000);
        user.hasUsedTrial = true;
        user.cancelAtPeriodEnd = false;

        await user.save();

        console.log('✅ User saved to database:', {
          phone: user.phone,
          subscriptionId: user.subscriptionId,
          status: user.subscriptionStatus
        });

        // Send welcome message in background (don't wait for it)
        if (!user.welcomeMessageSent) {
          sendWelcomeMessageAsync(user);
        }

        return res.status(200).json({
          success: true,
          data: {
            username: user.username,
            email: user.email,
            phone: user.phone,
            subscriptionStatus: user.subscriptionStatus,
            nextBillingDate: user.nextBillingDate,
            trialEndsAt: user.trialEndsAt
          }
        });
      }

      // Subscription exists but not yet authenticated (payment pending)
      console.log('⏳ Subscription pending authentication, status:', subscription.status);
      
      if (subscription.status === 'created') {
        return res.status(200).json({
          success: false,
          message: 'Payment not completed. Please complete the payment to activate your subscription.',
          status: 'payment_pending',
          data: {
            username: notes.username,
            email: notes.email,
            phone: notes.phone,
            subscriptionStatus: 'payment_pending'
          }
        });
      }
      
      return res.status(200).json({
        success: false,
        message: 'Subscription pending authorization',
        status: 'pending',
        data: {
          username: notes.username,
          email: notes.email,
          phone: notes.phone,
          subscriptionStatus: 'pending'
        }
      });

    } catch (razorpayError) {
      console.error('❌ Razorpay API error:', razorpayError.message);
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

  } catch (error) {
    console.error('❌ Error in checkSubscriptionUser:', error);
    next(error);
  }
};

// Helper function to send welcome message asynchronously
async function sendWelcomeMessageAsync(user) {
  try {
    const message = await generateWelcomeMessage(user.username, user.description);
    await sendWhatsAppMessage(user.phone, message);
    
    user.welcomeMessageSent = true;
    await user.save();
    
    console.log('📱 Welcome message sent to:', user.phone);
  } catch (error) {
    console.error('❌ Failed to send welcome message:', error.message);
    // Don't throw - welcome message failure shouldn't block the response
  }
}