import crypto from 'crypto';
import config from '../config/config.js';
import { AppError } from '../utils/error.js';

export const verifyRazorpaySignature = (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    
    if (!signature) {
      throw new AppError('Missing signature', 401);
    }

    const body = req.body.toString();
    
    const expectedSignature = crypto
      .createHmac('sha256', config.razorpay.webhookSecret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new AppError('Invalid signature', 401);
    }

    req.body = JSON.parse(body);
    next();
  } catch (error) {
    next(error);
  }
};