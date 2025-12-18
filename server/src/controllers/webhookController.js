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

    if (event.event === 'subscription.activated') {
      const subscription = event.payload.subscription.entity;
      const notes = subscription.notes || {};
      const description = reconstructDescription(notes);

      const trialEndsAt = subscription.start_at
        ? new Date(subscription.start_at * 1000)
        : null;

      const now = new Date();
      const status =
        trialEndsAt && now < trialEndsAt ? 'trial' : 'active';

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

      if (!user.welcomeMessageSent) {
        const message = await generateWelcomeMessage(
          user.username,
          user.description
        );
        await sendWhatsAppMessage(user.phone, message);
        user.welcomeMessageSent = true;
        await user.save();
      }
    }

    if (event.event === 'subscription.cancelled') {
      const subscription = event.payload.subscription.entity;

      await User.findOneAndUpdate(
        { subscriptionId: subscription.id },
        {
          cancelAtPeriodEnd: true,
          nextBillingDate: new Date(subscription.current_end * 1000),
        }
      );
    }

    if (event.event === 'subscription.completed') {
      await User.findOneAndUpdate(
        { subscriptionId: event.payload.subscription.entity.id },
        { subscriptionStatus: 'expired' }
      );
    }

    if (event.event === 'subscription.paused') {
      await User.findOneAndUpdate(
        { subscriptionId: event.payload.subscription.entity.id },
        { subscriptionStatus: 'paused' }
      );
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    next(error);
  }
};
