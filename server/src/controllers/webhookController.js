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
    console.log('Webhook payload:', JSON.stringify(event, null, 2));

    if (event.event === 'subscription.authenticated') {
      const subscription = event.payload.subscription.entity;
      const notes = subscription.notes || {};
      
      let existingUser = await User.findOne({ 
        $or: [
          { subscriptionId: subscription.id },
          { phone: notes.phone }
        ]
      });

      const description = reconstructDescription(notes);

      if (existingUser) {
        console.log('User exists, updating subscription status to active');
        
        existingUser.subscriptionId = subscription.id;
        existingUser.razorpayCustomerId = subscription.customer_id;
        existingUser.subscriptionStatus = 'active';
        existingUser.description = description || existingUser.description;
        existingUser.startDate = new Date(notes.startDate);
        existingUser.nextBillingDate = new Date(notes.nextBillingDate);
        
        await existingUser.save();
        console.log('User subscription reactivated:', existingUser.username, existingUser.phone);

        if (!existingUser.welcomeMessageSent) {
          const welcomeMessage = await generateWelcomeMessage(existingUser.username, existingUser.description);
          await sendWhatsAppMessage(existingUser.phone, welcomeMessage);
          console.log('Welcome message sent to:', existingUser.phone);
          await User.findByIdAndUpdate(existingUser._id, { welcomeMessageSent: true });
        } else {
          const reactivationMessage = `Welcome back, ${existingUser.username}! 🎉\n\nYour subscription is now active again. You'll continue receiving your daily affirmations at 8 AM.\n\nServed.`;
          await sendWhatsAppMessage(existingUser.phone, reactivationMessage);
          console.log('Reactivation message sent to:', existingUser.phone);
        }

        return res.status(200).json({ status: 'ok', message: 'User subscription reactivated' });
      }
      
      const user = new User({
        username: notes.username,
        email: notes.email,
        phone: notes.phone,
        description: description,
        subscriptionId: subscription.id,
        razorpayCustomerId: subscription.customer_id,
        startDate: new Date(notes.startDate),
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
        { subscriptionStatus: 'cancelled' },
        { new: true }
      );
      
      if (updated) {
        console.log('Subscription cancelled for user:', updated.username, updated.phone);
      } else {
        console.log('User not found for cancelled subscription:', subscription.id);
      }
    }

    if (event.event === 'subscription.paused') {
      const subscription = event.payload.subscription.entity;
      const updated = await User.findOneAndUpdate(
        { subscriptionId: subscription.id },
        { subscriptionStatus: 'paused' },
        { new: true }
      );
      
      if (updated) {
        console.log('Subscription paused for user:', updated.username, updated.phone);
      } else {
        console.log('User not found for paused subscription:', subscription.id);
      }
    }

    if (event.event === 'subscription.completed') {
      const subscription = event.payload.subscription.entity;
      const updated = await User.findOneAndUpdate(
        { subscriptionId: subscription.id },
        { subscriptionStatus: 'expired' },
        { new: true }
      );
      
      if (updated) {
        console.log('Subscription completed/expired for user:', updated.username, updated.phone);
      } else {
        console.log('User not found for completed subscription:', subscription.id);
      }
    }

    if (event.event === 'subscription.halted') {
      const subscription = event.payload.subscription.entity;
      const updated = await User.findOneAndUpdate(
        { subscriptionId: subscription.id },
        { subscriptionStatus: 'cancelled' },
        { new: true }
      );
      
      if (updated) {
        console.log('Subscription halted for user:', updated.username, updated.phone);
      } else {
        console.log('User not found for halted subscription:', subscription.id);
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    next(error);
  }
};