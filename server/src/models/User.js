import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    subscriptionId: { type: String },
    razorpayCustomerId: { type: String },

    subscriptionStatus: {
      type: String,
      enum: ['trial', 'active', 'paused', 'cancelled', 'expired'],
      default: 'trial',
    },

    hasUsedTrial: { type: Boolean, default: false },
    cancelAtPeriodEnd: { type: Boolean, default: false },

    trialEndsAt: { type: Date },
    startDate: { type: Date },
    nextBillingDate: { type: Date },

    lastMessageSentAt: { type: Date },
    welcomeMessageSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ subscriptionId: 1 });
userSchema.index({ subscriptionStatus: 1, nextBillingDate: 1 });

export default mongoose.model('User', userSchema);
