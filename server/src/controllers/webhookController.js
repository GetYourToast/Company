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

    console.log('Webhook received:', event.event);

    if (event.event === 'subscription.authenticated') {
      const subscription = event.payload.subscription.entity;
      const notes = subscription.notes || {};
      
      const description = reconstructDescription(notes);
      
      const existingUser = await User.findOne({ 
        $or: [
          { subscriptionId: subscription.id },
          { phone: notes.phone }
        ]
      });

      if (existingUser) {
        console.log('User already exists, skipping creation');
        return res.status(200).json({ status: 'ok', message: 'User already exists' });
      }
      
      const user = new User({
        username: notes.username,
        email: notes.email,
        phone: notes.phone,
        description: description,
        subscriptionId: subscription.id,
        razorpayCustomerId: subscription.customer_id,
        trialEndDate: new Date(notes.trialEndDate),
        nextBillingDate: new Date(notes.nextBillingDate),
        subscriptionStatus: 'active',
      });

      await user.save();
      console.log('User created successfully:', user._id);

      const welcomeMessage = await generateWelcomeMessage(user.username, user.description);
      await sendWhatsAppMessage(user.phone, welcomeMessage);
      console.log('Welcome message sent to:', user.phone);

      await User.findByIdAndUpdate(user._id, { welcomeMessageSent: true });
    }

    if (event.event === 'subscription.cancelled') {
      const subscription = event.payload.subscription.entity;
      const updated = await User.findOneAndUpdate(
        { subscriptionId: subscription.id },
        { subscriptionStatus: 'cancelled' }
      );
      console.log('Subscription cancelled:', subscription.id);
    }

    if (event.event === 'subscription.paused') {
      const subscription = event.payload.subscription.entity;
      const updated = await User.findOneAndUpdate(
        { subscriptionId: subscription.id },
        { subscriptionStatus: 'paused' }
      );
      console.log('Subscription paused:', subscription.id);
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    next(error);
  }
};