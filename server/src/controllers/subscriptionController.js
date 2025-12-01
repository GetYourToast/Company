import razorpay from "../config/razorpay.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";

export const createSubscription = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

   
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID, 
      total_count: 0, 
      customer_notify: 1,
    });

    const dbSub = await Subscription.create({
      userId: user._id,
      razorpaySubscriptionId: subscription.id,
      status: subscription.status,
      startAt: subscription.start_at ? new Date(subscription.start_at * 1000) : null,
    });

    return res.status(200).json({
      message: "Subscription created.",
      subscriptionId: subscription.id,
      subscription: dbSub,
    });
  } catch (err) {
    console.error("Subscription Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const verifySubscription = async (req, res) => {
  
  return res.json({ message: "Verification endpoint active." });
};
