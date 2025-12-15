// models/Subscription.js
import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  subscriptionId: {
    type: String,
    required: true,
    unique: true,
  },
  customerId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  description: String,
  serviceStartDate: {
    type: Date,
    required: true,
  },
  subscriptionStartDate: {
    type: Date,
    required: true,
  },
  nextBillingDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'paused', 'completed'],
    default: 'active',
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;