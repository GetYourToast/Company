// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage/LandingPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import AboutPage from "../components/Landing/About";
import FAQPage from "../components/Landing/FAQ";
import TermsOfService from "../components/Agreements/TermsofService";
import PrivacyPolicy from "../components/Agreements/PrivacyPolicy";
import ContactPage from "../components/Landing/ContactPage";
import PaymentSuccessPage from "../pages/ConfirmationPage/ConfirmationPage";
import AuthPage from "../pages/AuthPage/AuthPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage/>} />
        <Route path="/faq" element={<FAQPage/>} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/termsofservice" element={<TermsOfService />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/subscribe" element={<RegisterPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;