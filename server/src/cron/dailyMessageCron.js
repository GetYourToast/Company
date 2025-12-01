import cron from "node-cron";
import User from "../models/User.js";
import { createAndSendAffirmation } from "../services/affirmationService.js";


cron.schedule(
  "0 8 * * *",
  async () => {
    try {
      console.log("Daily Affirmation Cron Started — 8:00 AM IST");

      const now = new Date();

      
      const users = await User.find({
        isSubscribed: true,
      });

      console.log(`Found ${users.length} users to send messages to.`);

      for (const user of users) {
        try {
          
          if (user.trialEnd && now > user.trialEnd) {
            
            if (!user.subscriptionId) {
              console.log(
                `⏭ Skipping ${user.email} — Trial expired, no active subscription`
              );
              continue;
            }
          }

          await createAndSendAffirmation(user);

          console.log(`Message sent to ${user.name} (${user.whatsappNumber})`);
        } catch (inner) {
          console.error(
            `Failed to send message to ${user.email}:`,
            inner.message
          );
        }
      }

      console.log("Daily Affirmation Cron Completed");
    } catch (err) {
      console.error("Cron job error:", err.message);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);
