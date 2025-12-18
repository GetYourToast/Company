import User from '../models/User.js';
import { sendWhatsAppMessage } from '../services/whatsapp.js';
import { generateWelcomeMessage } from '../services/gemini.js';

const reconstructDescription = (notes) => {
  const chunks = [];
  let index = 0;

  while (notes[`desc_${index}`]) {
    chunks.push(notes[`desc_${index}`]);
    index++;
  }

  return chunks.join('');
};

export const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const event = req.body;

    if (event.event === 'subscription.authenticated') {
      const subscription = event.payload.subscription.entity;
      const notes = subscription.notes || {};
      const description = reconstructDescription(notes);

      const now = new Date();
      const trialEndsAt = notes.subscriptionStartDate
        ? new Date(notes.subscriptionStartDate)
        : null;

      const status =
        trialEndsAt && now < trialEndsAt ? 'trial' : 'active';

      let user = await User.findOne({
        $or: [
          { subscriptionId: subscription.id },
          { phone: notes.phone },
        ],
      });

      if (!user) {
        user = await User.findOne({ phone: notes.phone });
      }

      if (user) {
        user.subscriptionId = subscription.id;
        user.razorpayCustomerId = subscription.customer_id;
        user.subscriptionStatus = status;
        user.trialEndsAt = status === 'trial' ? trialEndsAt : null;
        user.description = description || user.description;
        user.startDate = new Date(notes.serviceStartDate);
        user.nextBillingDate = new Date(notes.nextBillingDate);
        await user.save();
      } else {
        user = new User({
          username: notes.username,
          email: notes.email,
          phone: notes.phone,
          description,
          subscriptionId: subscription.id,
          razorpayCustomerId: subscription.customer_id,
          subscriptionStatus: status,
          trialEndsAt: status === 'trial' ? trialEndsAt : null,
          startDate: new Date(notes.serviceStartDate),
          nextBillingDate: new Date(notes.nextBillingDate),
        });
        await user.save();
      }

      if (status === 'active' && !user.welcomeMessageSent) {
        const welcomeMessage = await generateWelcomeMessage(
          user.username,
          user.description
        );
        await sendWhatsAppMessage(user.phone, welcomeMessage);
        await User.findByIdAndUpdate(user._id, {
          welcomeMessageSent: true,
        });
      }
    }

    if (event.event === 'subscription.cancelled') {
      await User.findOneAndUpdate(
        { subscriptionId: event.payload.subscription.entity.id },
        { subscriptionStatus: 'cancelled' }
      );
    }

    if (event.event === 'subscription.paused') {
      await User.findOneAndUpdate(
        { subscriptionId: event.payload.subscription.entity.id },
        { subscriptionStatus: 'paused' }
      );
    }

    if (event.event === 'subscription.completed') {
      await User.findOneAndUpdate(
        { subscriptionId: event.payload.subscription.entity.id },
        { subscriptionStatus: 'expired' }
      );
    }

    if (event.event === 'subscription.halted') {
      await User.findOneAndUpdate(
        { subscriptionId: event.payload.subscription.entity.id },
        { subscriptionStatus: 'cancelled' }
      );
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
};
