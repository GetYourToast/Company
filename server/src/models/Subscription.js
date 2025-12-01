import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    razorpaySubscriptionId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "created",
        "active",
        "authenticated",
        "pending",
        "halted",
        "completed",
        "cancelled",
      ],
      default: "created",
    },

    startAt: { type: Date },
    endAt: { type: Date },
    nextBilling: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
