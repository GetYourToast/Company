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
        return existingCustomer;
      }
    }

    return await razorpay.customers.create({
      name: username,
      email,
      contact: phone,
    });
  } catch (error) {
    throw error;
  }
};

export const createRazorpaySubscription = async (userData) => {
  const TRIAL_DAYS = process.env.RAZORPAY_TRIAL_DAYS
    ? parseInt(process.env.RAZORPAY_TRIAL_DAYS)
    : 7;

  try {
    let planId = config.razorpay.planId;

    if (!planId) {
      const existingPlans = await razorpay.plans.all({ count: 100 });
      const matchingPlan = existingPlans.items.find(
        p =>
          p.item.amount === config.subscription.amount &&
          p.period === 'monthly' &&
          p.interval === 1
      );

      if (matchingPlan) {
        planId = matchingPlan.id;
      } else {
        const plan = await razorpay.plans.create({
          period: 'monthly',
          interval: 1,
          item: {
            name: 'Daily Affirmation Subscription',
            amount: config.subscription.amount,
            currency: config.subscription.currency,
          },
        });
        planId = plan.id;
      }
    }

    const customer = await findOrCreateCustomer(
      userData.email,
      userData.phone,
      userData.username
    );

    const now = new Date();
    const currentHour = now.getHours();

    let serviceStartDate;
    if (currentHour < 7) {
      serviceStartDate = new Date(now);
      serviceStartDate.setHours(8, 0, 0, 0);
    } else {
      serviceStartDate = new Date(now);
      serviceStartDate.setDate(serviceStartDate.getDate() + 1);
      serviceStartDate.setHours(8, 0, 0, 0);
    }

    const subscriptionStartDate = new Date(
      now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000
    );

    const nextBillingDate = new Date(serviceStartDate);
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const descriptionChunks = [];
    const maxChunkSize = 240;
    const desc = userData.description || '';

    for (let i = 0; i < desc.length; i += maxChunkSize) {
      descriptionChunks.push(desc.substring(i, i + maxChunkSize));
    }

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
      notes,
    });

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
      serviceStartDate: serviceStartDate.toISOString(),
      subscriptionStartDate: subscriptionStartDate.toISOString(),
      nextBillingDate: nextBillingDate.toISOString(),
      trialEndsAt: subscriptionStartDate.toISOString(),
      status: 'trial',
    };
  } catch (error) {
    if (error.error) {
      throw new AppError(
        error.error.description || error.error.reason || 'Failed to create subscription',
        500
      );
    }
    throw new AppError('Failed to create subscription', 500);
  }
};