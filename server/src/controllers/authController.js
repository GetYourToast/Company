import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const TRIAL_DAYS = parseInt(process.env.TRIAL_DAYS || "30", 10);

 
export const register = async (req, res) => {
  try {
    const { name, email, phone, description } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email & phone are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const now = new Date();
    const trialEnd = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      phone,
      whatsappNumber: phone, 
      description,
      trialStart: now,
      trialEnd,
      isSubscribed: true, 
    });

    return res.status(201).json({ message: "User registered.", user });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getUser = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    return res.json({ user });
  } catch (err) {
    console.error("GetUser Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
