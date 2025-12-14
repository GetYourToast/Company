import config from '../config/config.js';

export const checkEnvironment = () => {
  const required = [
    { key: 'MONGO_URI', value: config.mongoUri },
    { key: 'RAZORPAY_KEY_ID', value: config.razorpay.keyId },
    { key: 'RAZORPAY_KEY_SECRET', value: config.razorpay.keySecret },
    { key: 'WHATSAPP_TOKEN', value: config.whatsapp.token },
    { key: 'WHATSAPP_PHONE_ID', value: config.whatsapp.phoneId },
    { key: 'GEMINI_API_KEY', value: config.gemini.apiKey },
  ];

  const optional = [
    { key: 'RAZORPAY_WEBHOOK_SECRET', value: config.razorpay.webhookSecret },
    { key: 'RAZORPAY_PLAN_ID', value: config.razorpay.planId },
  ];

  const missing = required.filter(item => !item.value);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(item => console.error(`   - ${item.key}`));
    console.error('\n💡 Please check your .env file\n');
    return false;
  }

  console.log('✅ All required environment variables are set');
  
  const missingOptional = optional.filter(item => !item.value);
  if (missingOptional.length > 0) {
    console.log('⚠️  Optional variables not set:');
    missingOptional.forEach(item => {
      if (item.key === 'RAZORPAY_PLAN_ID') {
        console.log(`   - ${item.key} (will create new plan on first subscription)`);
      } else if (item.key === 'RAZORPAY_WEBHOOK_SECRET') {
        console.log(`   - ${item.key} (required for production webhooks)`);
      }
    });
  }
  
  console.log('');
  return true;
};