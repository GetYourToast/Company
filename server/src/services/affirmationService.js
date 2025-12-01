import { generateAffirmationText } from "./geminiService.js";
import { sendWhatsAppText } from "./whatsappService.js";
import AffirmationLog from "../models/AffirmationLog.js";

export async function createAndSendAffirmation(user) {
  // 1. Generate personalized affirmation using Gemini
  const text = await generateAffirmationText(user.name, user.description);

  // 2. Format the final WhatsApp message
  const message = `Good morning ${user.name}, here is your toast.\n\n${text}\n\nServed.`;

  // 3. Send WhatsApp message
  await sendWhatsAppText(user.whatsappNumber, message);

  // 4. Store in logs
  await AffirmationLog.create({
    userId: user._id,
    message,
    sentAt: new Date(),
  });

  return message;
}
