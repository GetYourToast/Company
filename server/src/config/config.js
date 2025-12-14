import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 6500,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    planId: process.env.RAZORPAY_PLAN_ID,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  },
  
  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL,
    token: process.env.WHATSAPP_TOKEN,
    phoneId: process.env.WHATSAPP_PHONE_ID,
  },
  
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },
  
  subscription: {
    amount: parseInt(process.env.SUBSCRIPTION_AMOUNT) || 9900,
    currency: 'INR',
    trialDays: parseInt(process.env.FREE_TRIAL_DAYS) || 30,
  },
};

export default config;