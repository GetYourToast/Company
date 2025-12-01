import mongoose from "mongoose";

const AffirmationLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: { type: String, required: true },

    sentAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

export default mongoose.models.AffirmationLog ||
  mongoose.model("AffirmationLog", AffirmationLogSchema);
