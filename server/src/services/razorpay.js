import Razorpay from 'razorpay';
import config from '../config/config.js';
import { AppError } from '../utils/error.js';

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

const DAY = 24 * 60 * 60 * 1000;

const findOrCreateCustomer = async (email, phone, username) => {
  const customers = await razorpay.customers.all({ email });
  if (customers.items?.length) {
    const existing = customers.items.find(c => c.email === email);
    if (existing) return existing;
  }

  return razorpay.customers.create({
    name: username,
    email,
    contact: phone,
  });
};

export const createRazorpaySubscription = async userData => {
  const TRIAL_DAYS = userData.skipTrial ? 0 : 7;

  try {
    let planId = config.razorpay.planId;

    if (!planId) {
      const plans = await razorpay.plans.all({ count: 100 });

      const match = plans.items.find(
        p =>
          p.item.amount === config.subscription.amount &&
          p.period === 'daily' &&
          p.interval === 30
      );

      if (match) {
        planId = match.id;
      } else {
        const plan = await razorpay.plans.create({
          period: 'daily',
          interval: 30,
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
    const serviceStartDate = new Date(now);
    serviceStartDate.setHours(8, 0, 0, 0);
    if (now.getHours() >= 7) serviceStartDate.setDate(serviceStartDate.getDate() + 1);

    const subscriptionStartDate = new Date(
      now.getTime() + TRIAL_DAYS * DAY
    );

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_id: customer.id,
      start_at: Math.floor(subscriptionStartDate.getTime() / 1000),
      total_count: 12,
      customer_notify: 1,
      notes: {
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        serviceStartDate: serviceStartDate.toISOString(),
      },
    });

    return {
      id: subscription.id,
      razorpay_key_id: config.razorpay.keyId,
      plan: subscription.plan,
    };
  } catch (error) {
    throw new AppError('Failed to create subscription', 500);
  }
};
