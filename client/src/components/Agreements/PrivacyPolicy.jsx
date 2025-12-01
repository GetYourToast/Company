import React from "react";
import toastLogo from "../../assets/icons/toastLogo.svg";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white border-2 border-dashed border-blue-400 rounded-lg p-8 lg:p-12">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 mb-3">
              Get Your Toast Privacy Policy
            </h1>
            <p className="text-sm italic text-neutral-600">
              Last updated: November 2, 2025
            </p>
          </div>

          {/* Intro */}
          <div className="mb-8 space-y-4">
            <h2 className="text-lg font-bold text-neutral-900">
              Hello again 👋
            </h2>
            <p className="text-neutral-700 leading-relaxed">
              Thanks for being part of Get Your Toast. This Privacy Policy
              explains how we handle your information — simply, respectfully,
              and transparently. We know privacy is personal, and we take that
              seriously.
            </p>
          </div>

          {/* Privacy Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                1. What We Collect
              </h3>
              <p className="text-neutral-700 leading-relaxed mb-2">
                To send you your daily toasts and process your subscription, we
                collect only what's necessary:
              </p>
              <ul className="list-disc list-inside text-neutral-700 leading-relaxed space-y-1 ml-4">
                <li>
                  <span className="font-semibold">Your WhatsApp number</span> —
                  so we can send you your daily message.
                </li>
                <li>
                  <span className="font-semibold">Your name</span> — if you
                  choose to share it.
                </li>
                <li>
                  <span className="font-semibold">Payment information</span> —
                  handled securely by Razorpay. We never see or store your full
                  card or UPI details.
                </li>
                <li>
                  <span className="font-semibold">Basic analytics</span> — like
                  delivery success and subscription status, to make sure
                  everything runs smoothly.
                </li>
              </ul>
              <p className="text-neutral-700 leading-relaxed mt-2">
                That's it. No hidden tracking, no unnecessary data collection.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                2. How We Use It
              </h3>
              <p className="text-neutral-700 leading-relaxed mb-2">
                We use your information only to:
              </p>
              <ul className="list-disc list-inside text-neutral-700 leading-relaxed space-y-1 ml-4">
                <li>Send your daily motivational message on WhatsApp</li>
                <li>Process and renew your subscription</li>
                <li>
                  Contact you if there's an issue with your account or payment
                </li>
                <li>
                  Occasionally share updates about Get Your Toast (if relevant)
                </li>
              </ul>
              <p className="text-neutral-700 leading-relaxed mt-2 font-semibold">
                We'll never sell, rent, or share your data with third parties
                for marketing. Ever.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                3. WhatsApp Messages
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                When you share your WhatsApp number with us, you're giving
                consent to receive daily messages from our verified business
                account. We send only what you signed up for — one message every
                morning. No ads, no spam, no clutter.
              </p>
              <p className="text-neutral-700 leading-relaxed mt-2">
                If you ever want to stop, you can just pause auto-renewal
                anytime from your UPI app or credit card platform — whichever
                you used to subscribe.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                4. Payments
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                All payments are processed securely through Razorpay, a trusted
                Indian payment gateway. Your sensitive payment information (like
                card or UPI details) never touches our servers — it goes
                straight to Razorpay, which handles it with bank-level
                encryption. We only receive basic transaction details (like
                payment success/failure status) so we can activate your
                subscription.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                5. Data Storage & Security
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                We store your information securely and only for as long as it's
                needed to provide the service. We use trusted cloud
                infrastructure and take precautions to prevent unauthorized
                access or misuse. While no system is ever 100% foolproof, we're
                committed to keeping your data as safe as possible.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                6. Data Sharing
              </h3>
              <p className="text-neutral-700 leading-relaxed mb-2">
                We don't share your data with anyone, except when:
              </p>
              <ul className="list-disc list-inside text-neutral-700 leading-relaxed space-y-1 ml-4">
                <li>Required by Indian law or a valid legal request</li>
                <li>Needed to process your payment via Razorpay</li>
                <li>
                  Needed to deliver WhatsApp messages through Meta's Business
                  API
                </li>
              </ul>
              <p className="text-neutral-700 leading-relaxed mt-2">
                Even in those cases, we share only what's absolutely necessary.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                7. Your Choices
              </h3>
              <p className="text-neutral-700 leading-relaxed mb-2">
                You have full control over your data. You can:
              </p>
              <ul className="list-disc list-inside text-neutral-700 leading-relaxed space-y-1 ml-4">
                <li>Unsubscribe anytime</li>
                <li>
                  Request deletion of your account or data by emailing us at{" "}
                  <span className="text-blue-600">getyourtoast1@gmail.com</span>
                </li>
                <li>
                  Update your WhatsApp number or preferences by contacting us
                </li>
              </ul>
              <p className="text-neutral-700 leading-relaxed mt-2">
                We'll process requests within a reasonable time.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                8. Cookies & Tracking
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                We use minimal cookies on our website — mostly for things like
                remembering your subscription status or making payments
                smoother. We don't track you across other websites or use
                advertising cookies.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                9. Children's Privacy
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                Get Your Toast is meant for people aged 18 and above. We don't
                knowingly collect data from minors.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                10. Changes to This Policy
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                We may update this Privacy Policy occasionally to make it
                clearer or reflect new features. If we make big changes, we'll
                notify you via email or WhatsApp before they take effect.
              </p>
            </div>

            {/* Section 11 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                11. Contact Us
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                If you have questions, feedback, or concerns about your privacy,
                email us anytime at{" "}
                <span className="text-blue-600">getyourtoast1@gmail.com</span>.
                We'll always do our best to help — no automated replies, no
                waiting forever.
              </p>
            </div>
          </div>

          {/* Closing */}
          <div className="mt-8 pt-8 border-t border-neutral-200">
            <p className="text-neutral-700 leading-relaxed font-medium">
              Thank you for trusting Get Your Toast. We'll keep your mornings
              inspiring — and your data safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
