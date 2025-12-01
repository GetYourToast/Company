import React from "react";
import toastLogo from "../../assets/icons/toastLogo.svg";

export default function TermsOfService() {
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
              Get Your Toast Terms of Service
            </h1>
            <p className="text-sm italic text-neutral-600">
              Last updated: November 2, 2025
            </p>
          </div>

          {/* Intro */}
          <div className="mb-8 space-y-4">
            <h2 className="text-lg font-bold text-neutral-900">Hey there 👋</h2>
            <p className="text-neutral-700 leading-relaxed">
              Welcome to Get Your Toast ("we," "our," or "us"). These Terms of
              Service ("Terms") explain how our little daily ritual works — and
              what you agree to when you use it.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              By signing up and using Get Your Toast, you agree to these Terms.
              It's simple, transparent, and meant to keep things clear for
              everyone.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                1. What We Do
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                Get Your Toast sends you one thoughtful affirmation every
                morning on WhatsApp — something short, real, and inspiring to
                start your day on the right note. We like to think of it as your
                daily slice of perspective.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                2. Who We Are
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                Get Your Toast is created and run by Barath M S & Gandheesh S A,
                based in India. If you ever need help or want to share feedback,
                you can reach us anytime at{" "}
                <span className="text-blue-600">getyourtoast1@gmail.com</span>.
                We actually read every message — promise.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                3. Using Get Your Toast
              </h3>
              <p className="text-neutral-700 leading-relaxed mb-2">
                To get your daily messages, you'll need to:
              </p>
              <ul className="list-disc list-inside text-neutral-700 leading-relaxed space-y-1 ml-4">
                <li>Share your WhatsApp number</li>
                <li>
                  Pay a small monthly subscription fee of ₹99 through Razorpay
                </li>
              </ul>
              <p className="text-neutral-700 leading-relaxed mt-2">
                That's it. Once you're in, you'll start getting your toasts
                every morning around 8 AM. Your subscription automatically
                renews each month unless you cancel. You can stop anytime — no
                complicated steps, no questions asked.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                4. Payments
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                Payments are processed safely through Razorpay, a trusted Indian
                payment gateway. We don't store or see your full payment details
                — that's handled directly by Razorpay. If your payment ever
                fails, your messages might pause until it's sorted. You'll
                always have the option to restart when you're ready.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                5. Cancel Anytime
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                We believe in simplicity — so you can cancel whenever you want.
                Just make sure to cancel before your next billing date to avoid
                being charged again. Since this is a digital service, once a
                payment is processed, it's non-refundable. But you'll still
                receive all your daily messages until your current plan ends.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                6. WhatsApp Messages
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                When you subscribe, you're giving us permission to send your
                daily toasts on WhatsApp. We'll only send what you signed up for
                — one message a day. No spam, no promotions, no noise.{" "}
                <span className="italic">If you ever want to stop</span>, you
                can just pause auto-renewal anytime from your UPI app or credit
                card platform — whichever you used to subscribe. No long forms.
                No customer support loops. Just you in control.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                7. Content & Ownership
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                All quotes, messages, and content shared through Get Your Toast
                belong to us. They're written or curated carefully — please
                don't copy or reuse them commercially without asking first. We
                love when you share a toast with friends, though — that's the
                point. Just keep it personal.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                8. Being Kind & Respectful
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                We expect everyone who uses Get Your Toast to do so kindly and
                respectfully. Please don't use the service to spam, harass, or
                break any laws. If something feels off or misused, we may pause
                or stop access to keep the experience healthy for everyone.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                9. Small Changes Happen
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                We're always improving — sometimes that means updating features,
                pricing, or policies. If we make any big changes, we'll let you
                know in advance (by email or WhatsApp).
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                10. Legal Bits
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                These Terms are governed by the laws of India, and any disputes
                will fall under the courts of Tamil Nadu, India. We'll always
                try to resolve any issue directly and respectfully before it
                gets anywhere near a courtroom.
              </p>
            </div>

            {/* Section 11 */}
            <div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">
                11. Contact Us
              </h3>
              <p className="text-neutral-700 leading-relaxed">
                If you ever need help, have feedback, or just want to share how
                a quote made your morning better, email us at{" "}
                <span className="text-blue-600">getyourtoast1@gmail.com</span>.
                We'd love to hear from you.
              </p>
            </div>
          </div>

          {/* Closing */}
          <div className="mt-8 pt-8 border-t border-neutral-200">
            <p className="text-neutral-700 leading-relaxed">
              That's it. Thanks for being part of this — it means a lot. We hope
              every morning with Get Your Toast gives you something small to
              think about, smile at, or carry with you through the day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
