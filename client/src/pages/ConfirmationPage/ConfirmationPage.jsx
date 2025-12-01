import React from "react";
import toastLogo from "../../assets/icons/toastLogo.svg";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";

export default function PaymentSuccessPage() {
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

        {/* Main Message */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            Welcome to the club!
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed">
            Your payment was successful. You're all set to start receiving your
            daily toasts.
          </p>
        </div>

        {/* Details Card */}
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
                  You'll receive your first thoughtful message on WhatsApp. Make
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
                  daily dose of inspiration.
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
                  Cancel or pause your subscription anytime from your UPI app or
                  payment platform. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="bg-neutral-900 text-white rounded-lg p-8 mb-8">
          <h2 className="text-lg font-semibold mb-6">
            Your Subscription Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-neutral-400 text-sm mb-1">Plan</p>
              <p className="text-lg font-semibold">Monthly Subscription</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm mb-1">Amount</p>
              <p className="text-lg font-semibold">₹99/month</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm mb-1">Delivery Time</p>
              <p className="text-lg font-semibold">8:00 AM IST Daily</p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm mb-1">Next Billing</p>
              <p className="text-lg font-semibold">One month from today</p>
            </div>
          </div>
        </div>

        <div className=" rounded-lg p-8 text-center">
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
