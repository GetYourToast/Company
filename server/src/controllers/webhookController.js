import User from '../models/User.js';
import { sendWhatsAppMessage } from '../services/whatsapp.js';
import { generateWelcomeMessage } from '../services/gemini.js';

const reconstructDescription = notes => {
  const chunks = [];
  let i = 0;
  while (notes[`desc_${i}`]) {
    chunks.push(notes[`desc_${i}`]);
    i++;
  }
  return chunks.join('');
};

export const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const event = req.body;

    // Handle UPI mandate success - this fires FIRST when autopay is authorized
    if (event.event === 'subscription.authenticated') {
      const subscription = event.payload.subscription.entity;
      const notes = subscription.notes || {};
      const description = reconstructDescription(notes);

      const trialEndsAt = subscription.start_at
        ? new Date(subscription.start_at * 1000)
        : null;

      const now = new Date();
      const status = trialEndsAt && now < trialEndsAt ? 'trial' : 'active';

      let user = await User.findOne({ phone: notes.phone });

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
      user.startDate = new Date(notes.serviceStartDate);
      user.nextBillingDate = new Date(subscription.current_end * 1000);
      user.hasUsedTrial = true;
      user.cancelAtPeriodEnd = false;

      await user.save();

      console.log('✅ User registered after UPI mandate success:', user.phone);

      // Send welcome message
      if (!user.welcomeMessageSent) {
        try {
          const message = await generateWelcomeMessage(
            user.username,
            user.description
          );
          await sendWhatsAppMessage(user.phone, message);
          user.welcomeMessageSent = true;
          await user.save();
        } catch (error) {
          console.error('Welcome message failed:', error);
        }
      }
    }

    // Handle subscription activation (backup/update)
    if (event.event === 'subscription.activated') {
      const subscription = event.payload.subscription.entity;
      const notes = subscription.notes || {};
      const description = reconstructDescription(notes);

      const trialEndsAt = subscription.start_at
        ? new Date(subscription.start_at * 1000)
        : null;

      const now = new Date();
      const status = trialEndsAt && now < trialEndsAt ? 'trial' : 'active';

      let user = await User.findOne({ phone: notes.phone });

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
      user.startDate = new Date(notes.serviceStartDate);
      user.nextBillingDate = new Date(subscription.current_end * 1000);
      user.hasUsedTrial = true;
      user.cancelAtPeriodEnd = false;

      await user.save();

      console.log('✅ User updated on activation:', user.phone);

      // Send welcome message if not sent
      if (!user.welcomeMessageSent) {
        try {
          const message = await generateWelcomeMessage(
            user.username,
            user.description
          );
          await sendWhatsAppMessage(user.phone, message);
          user.welcomeMessageSent = true;
          await user.save();
        } catch (error) {
          console.error('Welcome message failed:', error);
        }
      }
    }

    // Handle subscription cancellation
    if (event.event === 'subscription.cancelled') {
      const subscription = event.payload.subscription.entity;

      await User.findOneAndUpdate(
        { subscriptionId: subscription.id },
        {
          subscriptionStatus: 'cancelled',
          cancelAtPeriodEnd: true,
          nextBillingDate: new Date(subscription.current_end * 1000),
        }
      );

      console.log('✅ Subscription cancelled:', subscription.id);
    }

    // Handle subscription completion
    if (event.event === 'subscription.completed') {
      await User.findOneAndUpdate(
        { subscriptionId: event.payload.subscription.entity.id },
        { subscriptionStatus: 'expired' }
      );

      console.log('✅ Subscription completed:', event.payload.subscription.entity.id);
    }

    // Handle subscription pause
    if (event.event === 'subscription.paused') {
      await User.findOneAndUpdate(
        { subscriptionId: event.payload.subscription.entity.id },
        { subscriptionStatus: 'paused' }
      );

      console.log('✅ Subscription paused:', event.payload.subscription.entity.id);
    }

    // Handle subscription resumed
    if (event.event === 'subscription.resumed') {
      await User.findOneAndUpdate(
        { subscriptionId: event.payload.subscription.entity.id },
        { subscriptionStatus: 'active' }
      );

      console.log('✅ Subscription resumed:', event.payload.subscription.entity.id);
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    next(error);
  }
};