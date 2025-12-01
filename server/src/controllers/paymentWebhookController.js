import crypto from "crypto";
import User from "../models/User.js";
import Subscription from "../models/Subscription.js";

export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).send("Invalid webhook signature");
    }

    const event = req.body.event;
    const subscription = req.body.payload.subscription?.entity;

    
    if (event === "subscription.activated" || event === "subscription.charged") {
      const sub = await Subscription.findOne({
        razorpaySubscriptionId: subscription.id,
      });

      if (sub) {
        sub.status = subscription.status;
        sub.startAt = new Date(subscription.start_at * 1000);
        await sub.save();

        const user = await User.findById(sub.userId);
        if (user) {
          user.isSubscribed = true;
          user.subscriptionId = subscription.id;
          await user.save();
        }
      }
    }

   
    if (event === "subscription.cancelled") {
      const sub = await Subscription.findOne({
        razorpaySubscriptionId: subscription.id,
      });

      if (sub) {
        sub.status = "cancelled";
        await sub.save();

        const user = await User.findById(sub.userId);
        if (user) {
          user.isSubscribed = false;
          user.subscriptionId = null;
          await user.save();
        }
      }
    }

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Webhook Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
