import React, { useState } from 'react';
import toastLogo from "../../assets/icons/toastLogo.svg";
import Button from '../Button/Button';
import Footer from '../Footer/Footer';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "What exactly is Get Your Toast?",
          a: "Get Your Toast is a small daily ritual — we send you one meaningful affirmation or thought every morning on WhatsApp. It's like your morning coffee, but for your mind."
        },
        {
          q: "What time will I get my toast?",
          a: "Every day at 8:00 AM (IST). Right when your day's about to begin — short, thoughtful, and worth reading before you dive into the world."
        },
        {
          q: "How do I sign up?",
          a: "Just visit our website, enter your WhatsApp number, and complete the ₹99/month subscription through Razorpay. Once done, your daily toasts will start the very next morning."
        }
      ]
    },
    {
      category: "Billing & Payments",
      questions: [
        {
          q: "How do payments work?",
          a: "Payments are securely processed by Razorpay. You can pay via UPI, card, or net banking. Your subscription renews automatically every month unless you cancel."
        },
        {
          q: "Can I cancel anytime?",
          a: "Yes, absolutely. You can cancel anytime before your next billing date — no hidden steps, no forms, no questions. You can just pause auto-renewal anytime from your UPI app or credit card platform — whichever you used to subscribe."
        },
        {
          q: "Will I get a refund if I cancel?",
          a: "Once a payment is processed, it's non-refundable — but you'll still receive your toasts until the end of your billing period."
        }
      ]
    },
    {
      category: "Your Account",
      questions: [
        {
          q: "Can I change my WhatsApp number?",
          a: "Yes! Just email us your new number at getyourtoast1@gmail.com, and we'll update it for you within a day."
        },
        {
          q: "What kind of messages will I get?",
          a: "Just one message a day — something short, thoughtful, and genuine. No spam. No promotions. Our goal is to make you pause for a moment and feel a little lighter before your day starts."
        },
        {
          q: "Is my information safe?",
          a: "Totally. We only collect what's needed to send your messages and process payments. Your data is never shared, sold, or misused — you can read our Privacy Policy for details."
        }
      ]
    },
    {
      category: "More Questions",
      questions: [
        {
          q: "Why the name \"Get Your Toast\"?",
          a: "We've never revealed the story — but the best guesses win a free one-year subscription. Think you know it? Email us at getyourtoast1@gmail.com"
        },
        {
          q: "Still have questions?",
          a: "We're here for you. Just drop a note at getyourtoast1@gmail.com — we usually reply pretty fast."
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
       <nav className="border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex justify-between items-center">
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
          <Button label="Subscribe Now" to="/subscribe" />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-neutral-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1.5 bg-yellow-400 text-neutral-900 text-sm font-medium mb-6">
              SUPPORT
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              Everything you need to know about Get Your Toast. Can't find what you're looking for? Email us at getyourtoast1@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
        {faqs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-16">
            <h2 className="text-sm font-semibold text-neutral-500 tracking-wide uppercase mb-8 border-b border-neutral-200 pb-4">
              {category.category}
            </h2>
            <div className="space-y-4">
              {category.questions.map((faq, questionIndex) => {
                const isOpen = openIndex === `${categoryIndex}-${questionIndex}`;
                return (
                  <div 
                    key={questionIndex} 
                    className="border border-neutral-200 transition-all"
                  >
                    <button
                      onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                      className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-neutral-50 transition-colors"
                    >
                      <span className="text-lg font-medium text-neutral-900 pr-8">
                        {faq.q}
                      </span>
                      <svg 
                        className={`w-5 h-5 text-neutral-600 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-8 pb-6 pt-2">
                        <p className="text-neutral-600 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="bg-neutral-900 py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Still have questions?
          </h2>
          <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
            We're here to help. Reach out to us and we'll get back to you as soon as possible.
          </p>
       <Button label="Contact Support" to="/contact" />
        </div>
      </div>

      {/* Footer */}
     <Footer />
    </div>
  );
}