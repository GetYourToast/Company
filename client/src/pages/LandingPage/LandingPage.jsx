import React, { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";

const LandingPage = () => {
  const [userCount, setUserCount] = useState(0);

    useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/subscriptions/count`
        );
        setUserCount(res.data.count);
      } catch (error) {
        console.error("Failed to fetch user count", error);
      }
    };

    fetchUserCount();
  }, []);



  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-white text-center overflow-x-hidden sm:overflow-y-hidden overflow-y-auto">
      <Navbar />

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-grow px-4 sm:px-0 py-12 sm:py-0">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-5 tracking-tight">
          Wake up to something <br className="hidden sm:block" /> that feels good.
        </h1>

        <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
          One message of affirmation. 8AM, Every morning. <br className="hidden sm:block" />
          Sent to your WhatsApp.
        </p>

        <Button label="Subscribe Now" to="/subscribe" />

        <p className="text-gray-500 text-sm mt-6">
          Get Your Toast, everyday. 7 Days free, then ₹99/month.
        </p>
      </main>

      {/* Footer */}
      <footer className="pb-8">
        <h2 className="text-lg md:text-xl font-bold text-gray-900">{userCount}</h2>
        <p className="text-gray-500 text-sm">users love our toasts, everyday!</p>
      </footer>
    </div>
  );
};

export default LandingPage;
