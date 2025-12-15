import Razorpay from 'razorpay';
import config from '../config/config.js';
import { AppError } from '../utils/error.js';

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

const findOrCreateCustomer = async (email, phone, username) => {
  try {
    const customers = await razorpay.customers.all({ email });
    
    if (customers.items && customers.items.length > 0) {
      const existingCustomer = customers.items.find(c => c.email === email);
      if (existingCustomer) {
        console.log('Using existing Razorpay customer:', existingCustomer.id);
        return existingCustomer;
      }
    }

    const newCustomer = await razorpay.customers.create({
      name: username,
      email: email,
      contact: phone,
    });
    
    console.log('Created new Razorpay customer:', newCustomer.id);
    return newCustomer;
  } catch (error) {
    console.error('Customer creation/fetch error:', error);
    throw error;
  }
};

export const createRazorpaySubscription = async (userData) => {
  try {
    let planId = config.razorpay.planId;

    if (!planId) {
      const existingPlans = await razorpay.plans.all({ count: 100 });
      const matchingPlan = existingPlans.items.find(
        p => p.item.amount === config.subscription.amount && 
             p.period === 'monthly' && 
             p.interval === 1
      );

      if (matchingPlan) {
        planId = matchingPlan.id;
        console.log('Using existing plan:', planId);
      } else {
        const plan = await razorpay.plans.create({
          period: 'monthly',
          interval: 1,
          item: {
            name: 'Daily Affirmation Subscription',
            amount: config.subscription.amount,
            currency: config.subscription.currency,
            description: 'Monthly subscription for personalized daily affirmations',
          },
        });
        planId = plan.id;
        console.log('Created new plan:', planId);
      }
      
      console.log('💡 Add this to your .env: RAZORPAY_PLAN_ID=' + planId);
    }

    const customer = await findOrCreateCustomer(
      userData.email,
      userData.phone,
      userData.username
    );

    // Determine service start date based on current time
    const now = new Date();
    const currentHour = now.getHours();
    
    let serviceStartDate; // When to start sending messages at 8 AM
    let subscriptionMessage;
    
    if (currentHour < 7) {
      // Before 7:00 AM - Service starts TODAY at 8:00 AM
      serviceStartDate = new Date(now);
      serviceStartDate.setHours(8, 0, 0, 0);
      subscriptionMessage = 'Your first message will arrive today at 8:00 AM';
      console.log('⏰ Registered before 7:00 AM - Service starts TODAY at 8:00 AM');
    } else {
      // After 7:00 AM - Service starts TOMORROW at 8:00 AM
      serviceStartDate = new Date(now);
      serviceStartDate.setDate(serviceStartDate.getDate() + 1);
      serviceStartDate.setHours(8, 0, 0, 0);
      subscriptionMessage = 'Your first message will arrive tomorrow at 8:00 AM';
      console.log('⏰ Registered after 7:00 AM - Service starts TOMORROW at 8:00 AM');
    }

    console.log('Current time:', now.toLocaleString('en-IN'));
    console.log('Service start time:', serviceStartDate.toLocaleString('en-IN'));

    // Subscription starts NOW for immediate payment (within 2 minutes)
    const subscriptionStartDate = new Date(now.getTime() + (2 * 60 * 1000));

    // Next billing date is 1 month from service start date (not from payment date)
    const nextBillingDate = new Date(serviceStartDate);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    console.log('💰 First payment (₹99): Within 2 minutes');
    console.log('📅 Next billing date:', nextBillingDate.toLocaleString('en-IN'));

    const userDataForNotes = {
      username: userData.username,
      email: userData.email,
      phone: userData.phone,
      description: userData.description,
      serviceStartDate: serviceStartDate.toISOString(), // When messages START (8 AM)
      subscriptionStartDate: subscriptionStartDate.toISOString(), // When payment charged (NOW)
      nextBillingDate: nextBillingDate.toISOString(),
      registeredAt: now.toISOString(),
      messageTime: '08:00 AM IST',
    };

    // Handle long descriptions by chunking them
    const descriptionChunks = [];
    const maxChunkSize = 240;
    const desc = userData.description || '';
    
    for (let i = 0; i < desc.length; i += maxChunkSize) {
      descriptionChunks.push(desc.substring(i, i + maxChunkSize));
    }

    // Prepare notes object with size limits
    const notes = {
      username: userData.username.substring(0, 255),
      email: userData.email.substring(0, 255),
      phone: userData.phone.substring(0, 255),
      serviceStartDate: serviceStartDate.toISOString(),
      subscriptionStartDate: subscriptionStartDate.toISOString(),
      nextBillingDate: nextBillingDate.toISOString(),
      registeredAt: now.toISOString(),
      messageTime: '08:00 AM IST',
    };


    descriptionChunks.forEach((chunk, index) => {
      notes[`desc_${index}`] = chunk;
    });


    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_id: customer.id,
      total_count: 12, 
      quantity: 1,
      start_at: Math.floor(subscriptionStartDate.getTime() / 1000), 
      customer_notify: 1,
      notes: notes,
      addons: [],
    });

    console.log('✅ Subscription created:', subscription.id);
    console.log('💳 Payment status: Will be charged within 2 minutes');
    console.log('📱 First message delivery:', serviceStartDate.toLocaleString('en-IN'));
    console.log('📅 Billing cycle: Monthly from', serviceStartDate.toLocaleDateString('en-IN'));

    return {
      id: subscription.id,
      customer_id: customer.id,
      razorpay_key_id: config.razorpay.keyId,
      plan: {
        item: {
          amount: config.subscription.amount,
          currency: config.subscription.currency,
        },
      },
      customer_notify: 1,
      userData: userDataForNotes,
      serviceStartDate: serviceStartDate.toISOString(),
      subscriptionStartDate: subscriptionStartDate.toISOString(),
      nextBillingDate: nextBillingDate.toISOString(),
      subscriptionMessage: subscriptionMessage,
      paymentMessage: 'Payment of ₹99 will be charged within 2 minutes',
      messageTime: '8:00 AM IST Daily',
      status: 'created',
    };
  } catch (error) {
    console.error('❌ Razorpay error:', error);
    if (error.error) {
      const errorMessage = error.error.description || error.error.reason || 'Failed to create subscription';
      throw new AppError(errorMessage, 500);
    }
    throw new AppError('Failed to create subscription', 500);
  }
};