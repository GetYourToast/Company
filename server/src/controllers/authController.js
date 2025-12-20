
import User from '../models/User.js';
import { AppError } from '../utils/error.js';
import crypto from 'crypto';

const otpStore = new Map();


const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.length !== 10) {
      throw new AppError('Invalid phone number', 400);
    }


    const user = await User.findOne({ phone: `91${phone}` });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please sign up first.',
      });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes


    otpStore.set(phone, { otp, expiresAt, attempts: 0 });


    console.log(`OTP for ${phone}: ${otp}`);



    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',

      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      throw new AppError('Phone and OTP are required', 400);
    }

    const storedData = otpStore.get(phone);

    if (!storedData) {
      throw new AppError('OTP expired or not found. Please request a new one.', 400);
    }

  
    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(phone);
      throw new AppError('OTP expired. Please request a new one.', 400);
    }

   
    if (storedData.attempts >= 3) {
      otpStore.delete(phone);
      throw new AppError('Too many failed attempts. Please request a new OTP.', 429);
    }


    if (storedData.otp !== otp) {
      storedData.attempts += 1;
      otpStore.set(phone, storedData);
      throw new AppError('Invalid OTP', 400);
    }


    otpStore.delete(phone);


    const user = await User.findOne({ phone: `91${phone}` }).select(
      'username email phone description subscriptionStatus trialEndsAt nextBillingDate'
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        username: user.username,
        email: user.email,
        phone: user.phone,
        description: user.description,
        subscriptionStatus: user.subscriptionStatus,
        trialEndsAt: user.trialEndsAt,
        nextBillingDate: user.nextBillingDate,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserData = async (req, res, next) => {
  try {
    const { phone } = req.params;

    const user = await User.findOne({ phone: `91${phone}` }).select(
      'username email phone description subscriptionStatus trialEndsAt nextBillingDate'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};