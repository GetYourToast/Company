import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toastLogo from "../../assets/icons/toastLogo.svg";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [error, setError] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:6500";

  useEffect(() => {
    const subscriptionId = searchParams.get('subscription_id');

    if (!subscriptionId) {
      setError('No subscription information found');
      setLoading(false);
      return;
    }

    fetchSubscriptionDetails(subscriptionId);
  }, [searchParams]);

  const fetchSubscriptionDetails = async (subscriptionId, attempt = 1) => {
    const maxRetries = 8; // Increased retries
    const retryDelay = 2000; // 2 seconds between retries

    setRetryAttempt(attempt);

    try {
      console.log(`🔄 Fetching subscription details (attempt ${attempt}/${maxRetries})...`);
      
      const response = await fetch(`${backendURL}/api/subscriptions/details/${subscriptionId}`);
      const data = await response.json();

      console.log('📦 Response:', data);

      if (data.success && data.data) {
        console.log('✅ Subscription found!');
        setSubscriptionData(data.data);
        setLoading(false);
        return;
      }

      // If subscription is pending or not found yet, retry
      if (attempt < maxRetries) {
        console.log(`⏳ Subscription not ready yet, retrying in ${retryDelay/1000}s...`);
        setTimeout(() => {
          fetchSubscriptionDetails(subscriptionId, attempt + 1);
        }, retryDelay);
      } else {
        // Max retries reached
        console.log('⚠️ Max retries reached');
        setError('Payment successful! Your subscription is being processed. Please check your email and WhatsApp shortly.');
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Error fetching subscription:', err);
      
      if (attempt < maxRetries) {
        console.log(`🔄 Retrying due to error... (attempt ${attempt}/${maxRetries})`);
        setTimeout(() => {
          fetchSubscriptionDetails(subscriptionId, attempt + 1);
        }, retryDelay);
      } else {
        setError('Payment successful! Your subscription is being processed. You will receive a confirmation message shortly.');
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Processing Your Payment</h2>
          <p className="text-neutral-600 mb-4">Please wait while we confirm your subscription...</p>
          <p className="text-sm text-neutral-500">
            {retryAttempt > 0 ? `Checking... (${retryAttempt}/8)` : 'This usually takes a few seconds'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    const isSuccessMessage = error.includes('Payment successful');
    
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className={`w-16 h-16 ${isSuccessMessage ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {isSuccessMessage ? (
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            {isSuccessMessage ? 'Payment Successful!' : 'Oops!'}
          </h2>
          <p className="text-neutral-600 mb-6">{error}</p>
          <Button label="Go to Home" to="/" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 py-8">
        <div className="flex justify-center items-center">
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <img
                src={toastLogo}
                alt="Toast Logo"
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <h1 className="text-lg md:text-2xl font-semibold text-gray-900 whitespace-nowrap">
                Get your toast
              </h1>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Welcome to the club{subscriptionData?.username ? `, ${subscriptionData.username}` : ''}! 🎉
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed">
            Your payment was successful. You're all set to start receiving your
            daily toasts.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-8 mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-6">
            What happens next?
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-semibold text-neutral-900">
                1
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">
                  Tomorrow morning at 8 AM
                </h3>
                <p className="text-neutral-600">
                  You'll receive your first thoughtful message on WhatsApp{subscriptionData?.phone ? ` at ${subscriptionData.phone}` : ''}. Make
                  sure to save our number!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-semibold text-neutral-900">
                2
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">
                  Every single day
                </h3>
                <p className="text-neutral-600">
                  One message, every morning. No spam, no promotions, just your
                  daily dose of inspiration personalized for you.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-semibold text-neutral-900">
                3
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">
                  Manage anytime
                </h3>
                <p className="text-neutral-600">
                  {subscriptionData?.subscriptionStatus === 'trial' 
                    ? `You're on a 7-day free trial. After that, you'll be charged ₹99/month. ` 
                    : ''}
                  Cancel or pause your subscription anytime from your UPI app or
                  payment platform. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral-900 text-white rounded-lg p-8 mb-8">
          <h2 className="text-lg font-semibold mb-6">
            Your Subscription Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-neutral-400 text-sm mb-1">Subscriber</p>
              <p className="text-lg font-semibold">{subscriptionData?.username || 'Not available'}</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm mb-1">Email</p>
              <p className="text-lg font-semibold">{subscriptionData?.email || 'Not available'}</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm mb-1">WhatsApp Number</p>
              <p className="text-lg font-semibold">{subscriptionData?.phone || 'Not available'}</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm mb-1">Status</p>
              <p className="text-lg font-semibold capitalize">
                {subscriptionData?.subscriptionStatus === 'trial' ? '🎁 Free Trial' : 
                 subscriptionData?.subscriptionStatus === 'active' ? '✅ Active' : 
                 subscriptionData?.subscriptionStatus || 'Active'}
              </p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm mb-1">Amount</p>
              <p className="text-lg font-semibold">₹99/month</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm mb-1">Delivery Time</p>
              <p className="text-lg font-semibold">8:00 AM IST Daily</p>
            </div>
            {subscriptionData?.trialEndsAt && (
              <div>
                <p className="text-neutral-400 text-sm mb-1">Trial Ends</p>
                <p className="text-lg font-semibold">{formatDate(subscriptionData.trialEndsAt)}</p>
              </div>
            )}
            <div>
              <p className="text-neutral-400 text-sm mb-1">Next Billing</p>
              <p className="text-lg font-semibold">{formatDate(subscriptionData?.nextBillingDate)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-3">
            Need help or have questions?
          </h2>
          <p className="text-neutral-800 mb-6">
            We're here for you. Just drop us a message and we'll reply as soon
            as we can.
          </p>
          <Button label="Contact Support" to="/contact" />
        </div>

        <div className="text-center mt-12 pt-12 border-t border-neutral-200">
          <p className="text-lg text-neutral-700 leading-relaxed">
            Thank you for joining Get Your Toast. We can't wait to be part of
            your mornings. 🌅
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}