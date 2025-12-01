import React, { useState } from 'react';
import toastLogo from "../../assets/icons/toastLogo.svg";
import Footer from '../Footer/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    query: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.query) {
      alert('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', query: '' });
      
      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1000);
  };

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
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg"
            />
            <h1 className="text-lg md:text-2xl font-semibold text-gray-900 whitespace-nowrap">
              Get your toast
            </h1>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-16 lg:py-24">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-yellow-400 text-neutral-900 text-sm font-medium mb-6">
            CONTACT US
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4 leading-tight tracking-tight">
            Get in Touch
          </h1>
          <p className="text-lg text-neutral-600">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white border-2 border-dashed border-blue-400 rounded-lg p-8 lg:p-12">
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-center font-medium">
                ✓ Thanks for reaching out! We'll get back to you soon.
              </p>
            </div>
          )}

          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-neutral-900 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="Your name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-900 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="your@email.com"
              />
            </div>

            {/* Query Field */}
            <div>
              <label htmlFor="query" className="block text-sm font-semibold text-neutral-900 mb-2">
                What's on your mind
              </label>
              <textarea
                id="query"
                name="query"
                value={formData.query}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none"
                placeholder="Tell us what's on your mind..."
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-neutral-900 text-white py-4 rounded-lg font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>

          {/* Alternative Contact */}
          <div className="mt-8 pt-8 border-t border-neutral-200 text-center">
            <p className="text-neutral-600 mb-2">Or email us directly at</p>
            <a 
              href="mailto:getyourtoast1@gmail.com" 
              className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              getyourtoast1@gmail.com
            </a>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div className="bg-white border border-neutral-200 p-6 rounded-lg">
            <h3 className="font-semibold text-neutral-900 mb-2">Quick Response</h3>
            <p className="text-sm text-neutral-600">We typically respond within 24 hours on business days.</p>
          </div>
          <div className="bg-white border border-neutral-200 p-6 rounded-lg">
            <h3 className="font-semibold text-neutral-900 mb-2">Real Humans</h3>
            <p className="text-sm text-neutral-600">No bots, no automated replies. Just us, the two brothers.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
     <Footer />
    </div>
  );
}