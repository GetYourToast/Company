import cron from "node-cron";
import User from "../models/User.js";
import { generateAffirmation } from "../config/gemini.js";
import { sendWhatsAppMessage } from "../config/whatsapp.js";

export const startDailyAffirmations = () => {
  cron.schedule(
    "0 8 * * *",
    async () => {
      const users = await User.find({ isActive: true });

      for (const user of users) {
        const affirmation = await generateAffirmation(user.description);
        await sendWhatsAppMessage(user.phone, affirmation);
      }
    },
    { timezone: process.env.CRON_TIMEZONE }
  );
};
