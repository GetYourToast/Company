import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Navbar from "../../components/Navbar/Navbar";

const AuthPage = () => {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:6500";


  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");


  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleSignUp = () => {
    navigate("/subscribe");
  };

  const handleSendOTP = async () => {
    if (mobileNumber.length !== 10) {
      showMessage("Please enter a valid 10-digit mobile number", "error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${backendURL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobileNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          showMessage("User not found. Please sign up first.", "error");
          setTimeout(() => navigate("/subscribe"), 2000);
          return;
        }
        throw new Error(data.message || "Failed to send OTP");
      }

      setOtpSent(true);
      showMessage("OTP sent to your WhatsApp!", "success");

      if (data.otp) {
        console.log("DEV OTP:", data.otp);
      }
    } catch (err) {
      showMessage(err.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      showMessage("Please enter a valid 6-digit OTP", "error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(`${backendURL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobileNumber, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      sessionStorage.setItem("prefilledUserData", JSON.stringify(data.data));

      showMessage("Verification successful! Redirecting...", "success");
      setTimeout(() => navigate("/subscribe"), 1500);
    } catch (err) {
      showMessage(err.message || "OTP verification failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    setOtp("");
    setOtpSent(false);
    setMessage("");
    handleSendOTP();
  };

 
  return (
    <div className="min-h-screen w-full bg-white flex flex-col overflow-x-hidden">
      <Navbar />

      <div className="flex flex-col md:flex-row items-stretch justify-center w-full flex-grow px-6 md:px-24 py-12 md:py-20 gap-8 md:gap-0">
        
    
        <div className="w-full md:w-1/2 flex flex-col justify-center md:pr-12 md:border-r border-gray-200">
          <div className="max-w-md mx-auto md:mx-0 w-full">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              New here?
            </h2>

            <p className="text-gray-500 mb-8">
              Start your journey to daily affirmations. Sign up and get your first
              toast delivered every morning.
            </p>

            <Button
              label="Sign Up"
              to="/subscribe"
            />

            <p className="text-amber-600 font-medium text-sm text-center mt-4">
              ✨ 7 days FREE trial • Then ₹99/month
            </p>

            <p className="text-gray-400 text-center mt-6 text-xs">
              No apps. No ads. Just good energy.
            </p>
          </div>
        </div>


        <div className="w-full md:w-1/2 flex flex-col justify-center md:pl-12">
          <div className="max-w-md mx-auto md:mx-0 w-full">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Welcome back!
            </h2>

            <p className="text-gray-500 mb-8">
              Continue receiving your daily dose of positivity and warmth.
            </p>

            <div className="space-y-6">
        
              <div className="flex flex-col">
                <label htmlFor="mobile" className="text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="9812345678"
                  className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  maxLength="10"
                  disabled={otpSent}
                />
              </div>

            
              {otpSent && (
                <div className="flex flex-col">
                  <label htmlFor="otp" className="text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center text-lg tracking-widest"
                    maxLength="6"
                  />
                  <button
                    onClick={handleResendOTP}
                    className="text-amber-600 text-sm mt-2 hover:text-amber-700 text-left"
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                </div>
              )}

    
              <Button
                label={loading ? "Please wait..." : otpSent ? "Verify & Sign In" : "Send OTP"}
                onClick={otpSent ? handleVerifyOTP : handleSendOTP}
                disabled={loading}
              />

       
              {message && (
                <div className={`p-4 rounded-lg text-sm font-medium ${
                  messageType === "success" ? "bg-green-50 text-green-700" :
                  messageType === "error" ? "bg-red-50 text-red-700" :
                  "bg-amber-50 text-amber-700"
                }`}>
                  {message}
                </div>
              )}
            </div>

            <p className="text-gray-400 text-center mt-8 text-xs">
              🔒 Secure authentication • Your data is safe
            </p>
          </div>
        </div>
      </div>

   
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <div className="flex gap-2">
          <Button label="Sign Up" to="/subscribe" />
          <Button
            label={loading ? "..." : otpSent ? "Verify" : "Sign In"}
            onClick={otpSent ? handleVerifyOTP : handleSendOTP}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;