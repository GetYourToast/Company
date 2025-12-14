import cron from 'node-cron';
import User from '../models/User.js';
import { generateDailyAffirmation } from './gemini.js';
import { sendWhatsAppMessage } from './whatsapp.js';

export const startScheduler = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily affirmation job at 8 AM IST');
    await sendDailyAffirmations();
  }, {
    timezone: 'Asia/Kolkata'
  });

  console.log('Scheduler initialized - Daily affirmations will be sent at 8 AM IST');
};

const sendDailyAffirmations = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const users = await User.find({
      subscriptionStatus: 'active',
      nextBillingDate: { $lte: today },
    });

    console.log(`Found ${users.length} users to send affirmations`);

    for (const user of users) {
      try {
        const affirmation = await generateDailyAffirmation(user.username, user.description);
        
        const message = `Good morning ${user.username}, here is your toast.\n\n${affirmation}\n\nServed.`;
        
        await sendWhatsAppMessage(user.phone, message);
        
        await User.findByIdAndUpdate(user._id, {
          lastMessageSentAt: new Date(),
        });

        console.log(`Affirmation sent to ${user.username} (${user.phone})`);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to send affirmation to ${user.username}:`, error);
      }
    }

    console.log('Daily affirmation job completed');
  } catch (error) {
    console.error('Error in daily affirmation job:', error);
  }
};