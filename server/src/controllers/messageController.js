import User from "../models/User.js";
import AffirmationLog from "../models/AffirmationLog.js";
import { createAndSendAffirmation } from "../services/affirmationService.js";


export const sendTestMessage = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: "userId required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const message = await createAndSendAffirmation(user);

    return res.json({ messageSent: message });
  } catch (err) {
    console.error("Test Message Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getAllMessages = async (req, res) => {
  try {
    const logs = await AffirmationLog.find().populate("userId", "name email");
    return res.json({ logs });
  } catch (err) {
    console.error("Logs Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
