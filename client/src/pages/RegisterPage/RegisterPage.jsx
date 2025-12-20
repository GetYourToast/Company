import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Navbar from "../../components/Navbar/Navbar";

import img1 from "../../assets/images/1.png";
import img2 from "../../assets/images/2.png";
import img3 from "../../assets/images/3.png";
import img4 from "../../assets/images/4.png";
import img5 from "../../assets/images/5.png";
import logo from "../../assets/images/toastLogo.png";

const RegisterPage = () => {
  const navigate = useNavigate();
  const images = [img1, img2, img3, img4, img5];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  

  const [isExistingUser, setIsExistingUser] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); 

  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:6500";


  useEffect(() => {
    const prefilledData = sessionStorage.getItem("prefilledUserData");
    if (prefilledData) {
      try {
        const userData = JSON.parse(prefilledData);
        
 
        setUsername(userData.username || "");
        setEmail(userData.email || "");
        setPhone(userData.phone ? userData.phone.replace("91", "") : "");
        setDescription(userData.description || "");
        setSubscriptionStatus(userData.subscriptionStatus || null);
        setIsExistingUser(true);
        

        if (userData.subscriptionStatus === 'cancelled' || userData.subscriptionStatus === 'expired') {
          setMessage("Welcome back! Your subscription has ended. Update your info and renew. ✨");
        } else if (userData.subscriptionStatus === 'trial' || userData.subscriptionStatus === 'active') {
          setMessage("Welcome back! Your information has been pre-filled. Update if needed. ✨");
        } else {
          setMessage("Welcome back! Your information has been pre-filled. ✨");
        }
        
 
        sessionStorage.removeItem("prefilledUserData");

        setTimeout(() => setMessage(""), 5000);
      } catch (error) {
        console.error("Error parsing prefilled data:", error);
      }
    }
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      setMessage("Payment system unavailable. Please try again later.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function sanitizeIndianNumber(raw) {
    if (!raw) return null;
    const digits = raw.replace(/\D/g, "");
    if (digits.length === 10) return "91" + digits;
    if (digits.length === 12 && digits.startsWith("91")) return digits;
    if (digits.length === 13 && digits.startsWith("091")) return digits.slice(1);
    return null;
  }


  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!username || !phone || !email || !description) {
      setMessage("Please fill all fields ✨");
      setLoading(false);
      return;
    }

    const cleanNumber = sanitizeIndianNumber(phone);
    if (!cleanNumber) {
      setMessage("Please enter a valid 10-digit Indian number (e.g. 9812345678)");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendURL}/api/subscriptions/update-user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          phone: cleanNumber,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user information");
      }

      setMessage("Your information has been updated successfully!");
      

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Update error:", err);
      setMessage("Failed to update information. Please try again.");
      setLoading(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!username || !phone || !email || !description) {
      setMessage("Please fill all fields ✨");
      setLoading(false);
      return;
    }

    const cleanNumber = sanitizeIndianNumber(phone);
    if (!cleanNumber) {
      setMessage("Please enter a valid 10-digit Indian number (e.g. 9812345678)");
      setLoading(false);
      return;
    }

    if (!razorpayLoaded) {
      setMessage("Payment system loading... Please wait and try again.");
      setLoading(false);
      return;
    }

    try {
      const subRes = await fetch(`${backendURL}/api/subscriptions/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          phone: cleanNumber,
          description,
        }),
      });

      const subData = await subRes.json();
      
      if (!subRes.ok) {
        console.error("Subscription create failed:", subData);
        setMessage(subData.message || "Unable to create subscription");
        setLoading(false);
        return;
      }

      if (!subData.success || !subData.data) {
        console.error("Invalid response format:", subData);
        setMessage("Subscription creation failed");
        setLoading(false);
        return;
      }

      const { subscriptionId, razorpayKey, amount, currency, userData } = subData.data;

      if (!subscriptionId || !razorpayKey) {
        console.error("Missing subscription data:", subData.data);
        setMessage("Subscription creation failed");
        setLoading(false);
        return;
      }

      openRazorpayPopup(subscriptionId, razorpayKey, amount, currency, userData);

    } catch (err) {
      console.error("Submit error:", err);
      setMessage("Server connection failed. Please check your internet and try again.");
      setLoading(false);
    }
  };

  const openRazorpayPopup = (subscriptionId, razorpayKey, amount, currency, userData) => {
    const options = {
      key: razorpayKey,
      subscription_id: subscriptionId,
      name: "Get Your Toast",
      description: isExistingUser && (subscriptionStatus === 'cancelled' || subscriptionStatus === 'expired')
        ? "Renew your subscription. ₹99/month."
        : "7-day free trial. ₹99/month after trial ends.",
      image: logo,

      handler: function () {
        navigate(`/payment-success?subscription_id=${subscriptionId}`);
      },

      modal: {
        ondismiss: function () {
          setMessage("Payment cancelled. No charges were made.");
          setLoading(false);
        }
      },

      notes: {
        "Trial Period": isExistingUser && (subscriptionStatus === 'cancelled' || subscriptionStatus === 'expired') ? "No trial" : "7 days free",
        "Charge Today": "₹0",
        "After Trial": "₹99 per month",
        "Billing": "Auto-debit after trial",
      },

      theme: {
        color: "#2563EB",
      },
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response) {
      console.error("Payment failed:", response.error);
      setMessage(`Payment failed: ${response.error.description || 'Please try again.'}`);
      setLoading(false);
    });

    rzp.open();
  };

  const shouldShowPayNow = isExistingUser && (subscriptionStatus === 'cancelled' || subscriptionStatus === 'expired');
  const shouldShowUpdate = isExistingUser && (subscriptionStatus === 'trial' || subscriptionStatus === 'active');
  
  const buttonText = loading 
    ? "Processing..." 
    : shouldShowUpdate 
      ? "Update Information" 
      : shouldShowPayNow 
        ? "Renew Subscription" 
        : razorpayLoaded 
          ? "Start 7-Day Free Trial" 
          : "Loading...";

  const handleFormSubmit = shouldShowUpdate ? handleUpdateUser : handleSubmit;

  return (
    <div className="min-h-screen w-full bg-white flex flex-col overflow-x-hidden sm:overflow-y-hidden overflow-y-auto">
      <Navbar />

      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full px-6 md:px-24 py-12 md:py-20">
        <div className="w-full md:w-1/2 h-[320px] md:h-[520px] relative overflow-hidden rounded-2xl shadow-md mb-10 md:mb-0">
          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt="Carousel"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center md:pl-20">
          <div className="mb-10 text-center md:text-left">
           
            {isExistingUser && (
              <div className="inline-flex items-center mb-3">
                {(subscriptionStatus === 'trial' || subscriptionStatus === 'active') && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    ✓ Active Subscriber
                  </span>
                )}
                {(subscriptionStatus === 'cancelled' || subscriptionStatus === 'expired') && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                    ⚠ Subscription Ended
                  </span>
                )}
              </div>
            )}

            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-snug tracking-tight mb-4">
              Everyone deserves a little love, <br className="hidden md:block" />
              <span className="text-gray-700">first thing in the morning.</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-md mx-auto md:mx-0">
              Start your day with warmth and positivity. Get personalized affirmations delivered to your WhatsApp every morning at 8 AM.
            </p>
            {!shouldShowUpdate && (
              <p className="text-amber-600 font-medium text-sm mt-3">
                {shouldShowPayNow 
                  ? "💫 Renew now • Just ₹99/month" 
                  : "✨ 7 days FREE trial • Then just ₹99/month"}
              </p>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-7 w-full max-w-md mx-auto md:mx-0">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Jane"
                className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                required
              />
            </div>
            
            <div className="flex flex-col md:flex-row md:space-x-5">
              <div className="flex flex-col w-full md:w-1/2">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                  required
                />
              </div>

              <div className="flex flex-col w-full md:w-1/2 mt-5 md:mt-0">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9812345678"
                  className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                  disabled={isExistingUser} 
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Tell us about yourself
                  {shouldShowUpdate && (
                    <span className="text-amber-600 text-xs ml-2">
                      (Update if anything changed)
                    </span>
                  )}
                </label>
                <span className={`text-xs ${
                  description.length > 2000 ? 'text-red-500' : 
                  description.length > 1800 ? 'text-amber-500' : 
                  'text-gray-400'
                }`}>
                  {description.length}/2000
                </span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's happening in your life? What are your goals or challenges? This helps us personalize your affirmations. Be as detailed as you'd like - you have up to 2000 characters!"
                className="border border-gray-300 rounded-lg px-4 py-2.5 h-32 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-none transition"
                maxLength="2000"
                required
              ></textarea>
              {description.length < 10 && description.length > 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  Please write at least 10 characters
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                disabled={loading || (!shouldShowUpdate && !razorpayLoaded)}
              >
                {buttonText}
              </button>
            </div>
          </form>

          {message && (
            <div className={`text-center md:text-left mt-6 p-4 rounded-lg ${
              message.includes("✅") || message.includes("Welcome") 
                ? "bg-green-50 text-green-700" 
                : message.includes("failed") || message.includes("cancelled")
                ? "bg-red-50 text-red-700"
                : "bg-amber-50 text-amber-700"
            }`}>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          <p className="text-gray-400 text-center md:text-left mt-8 text-xs">
            {shouldShowUpdate 
              ? "🔒 Your data is secure • Cancel anytime from settings"
              : "🔒 Secure payment via Razorpay • Cancel anytime • No hidden charges"}
          </p>
          <p className="text-gray-400 text-center md:text-left mt-2 text-sm">
            No apps. No ads. Just good energy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;