import React, { useState, useEffect } from "react";
import Button from "../../components/Button/Button";
import Navbar from "../../components/Navbar/Navbar";

const RegisterPage = () => {
  const images = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1600&q=80",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:6500";


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  function sanitizeIndianNumber(raw) {
  if (!raw) return null;
  // remove non-digits
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return "91" + digits;        // 9876543210 -> 919876543210
  if (digits.length === 12 && digits.startsWith("91")) return digits; // 919876543210 -> same
  if (digits.length === 13 && digits.startsWith("091")) return digits.slice(1); // 091... -> fix
  return null; // invalid
}


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  // basic client validation
  if (!name || !whatsapp || !email || !description) {
    setMessage("Please fill all fields ✨");
    setLoading(false);
    return;
  }

  const cleanNumber = sanitizeIndianNumber(whatsapp);
  if (!cleanNumber) {
    setMessage("Please enter a valid 10-digit Indian number (e.g. 9812345678)");
    setLoading(false);
    return;
  }

  try {
    // 1) Register user
    const registerRes = await fetch(`${backendURL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone: cleanNumber,         // backend expects phone
        whatsappNumber: cleanNumber, // whatsapp-ready format
        description,
      }),
    });

    const registerData = await registerRes.json();
    if (!registerRes.ok) {
      console.error("Register failed:", registerData);
      setMessage(registerData.message || "Registration failed");
      setLoading(false);
      return;
    }

    const userId = registerData.user?._id;
    if (!userId) {
      console.error("No userId from register:", registerData);
      setMessage("Registration response invalid");
      setLoading(false);
      return;
    }
    console.log("Backend URL:", backendURL);


    // 2) Create subscription
    const subRes = await fetch(`${backendURL}/api/subscription/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const subData = await subRes.json();
    if (!subRes.ok) {
      console.error("Subscription create failed:", subData);
      setMessage(subData.message || "Unable to create subscription");
      setLoading(false);
      return;
    }

    const subscriptionId = subData.subscriptionId || subData.subscription?.razorpaySubscriptionId;
    if (!subscriptionId) {
      console.error("No subscriptionId:", subData);
      setMessage("Subscription creation failed: missing ID");
      setLoading(false);
      return;
    }

    // 3) Open Razorpay popup
    openRazorpayPopup(subscriptionId, userId);
  } catch (err) {
    console.error("Submit error:", err);
    setMessage("Server connection failed");
  } finally {
    setLoading(false);
  }
};


const openRazorpayPopup = (subscriptionId, userId) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    subscription_id: subscriptionId,
    name: "Toast Subscription",
    description: "Your daily morning affirmation",
    handler: function (response) {
      console.log("Payment success:", response);
      setMessage("Payment successful! Subscription activated soon 🎉");
    },
    theme: { color: "#F4B400" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};



  return (
    <div className="min-h-screen w-full bg-white flex flex-col overflow-x-hidden sm:overflow-y-hidden overflow-y-auto">
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between w-full px-6 md:px-24 py-12 md:py-20">
        {/* Left Carousel */}
        <div className="w-full md:w-1/2 h-[320px] md:h-[520px] relative overflow-hidden rounded-2xl shadow-md mb-10 md:mb-0">
          <img
            key={currentIndex}
            src={images[currentIndex]}
            alt="Carousel"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center md:pl-20">
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-snug tracking-tight mb-4">
              Everyone deserves a little love, <br className="hidden md:block" />
              <span className="text-gray-700">first thing in the morning.</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed max-w-md mx-auto md:mx-0">
              Start your day with warmth and positivity. Sign up to receive something good — made with care, just for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7 w-full max-w-md mx-auto md:mx-0">
            <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane"
                  className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
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
                />
              </div>

              <div className="flex flex-col w-full md:w-1/2 mt-5 md:mt-0">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="10 digits"
                  className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                A Little About You
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us something nice..."
                className="border border-gray-300 rounded-lg px-4 py-2.5 h-28 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-none transition"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
  type="submit"
  className="w-full bg-amber-500 text-white py-3 rounded-lg font-medium transition hover:bg-amber-600 disabled:bg-gray-400"
  disabled={loading}
>
  {loading ? "Processing..." : "Pay Now"}
</button>

            </div>
          </form>

          {message && (
            <p className="text-center md:text-left mt-6 text-sm text-gray-700">
              {message}
            </p>
          )}

          <p className="text-gray-400 text-center md:text-left mt-12 text-sm">
            No apps. No ads. Just good energy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
