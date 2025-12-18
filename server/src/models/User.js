import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  subscriptionId: {
    type: String,
    required: true,
  },
  razorpayCustomerId: {
    type: String,
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'paused', 'cancelled', 'expired', 'pending', 'trial'],
    default: 'pending',
  },
  trialEndsAt: {
  type: Date,
},
  startDate: {
    type: Date,
  },
  nextBillingDate: {
    type: Date,
    required: true,
  },
  lastMessageSentAt: {
    type: Date,
  },
  welcomeMessageSent: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ subscriptionId: 1 });
userSchema.index({ subscriptionStatus: 1, nextBillingDate: 1 });
userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);