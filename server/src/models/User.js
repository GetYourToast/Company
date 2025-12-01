import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    phone: { type: String },

    whatsappNumber: { type: String, required: true }, // used for message delivery

    description: { type: String, default: "" },

    trialStart: { type: Date },
    trialEnd: { type: Date },

    isSubscribed: { type: Boolean, default: false },

    subscriptionId: { type: String, default: null }, // Razorpay subscription ID
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
