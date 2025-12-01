import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // icons for hamburger and close
import toastLogo from "../../assets/icons/toastLogo.svg"; // adjust path

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative w-full bg-white py-6 px-6 md:px-20 shadow-sm">
      {/* Logo centered */}
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

      {/* Desktop Links */}
      <div className="hidden md:flex justify-between items-center absolute top-1/2 left-0 w-full transform -translate-y-1/2 px-20">
        <div className="flex space-x-10 text-gray-800 font-medium text-base">
         
          <Link to="/about" className="hover:text-yellow-600 transition-colors">
            About
          </Link>
          <Link to="/faq" className="hover:text-yellow-600 transition-colors">
            FAQ
          </Link>
        </div>
        <div className="text-gray-800 font-medium text-base">
          <Link
           to="/contact"
           className="hover:text-yellow-600 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="absolute left-6 top-6 md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-800 focus:outline-none"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md z-50">
          <div className="flex flex-col items-center space-y-4 py-4 text-gray-800 font-medium text-base">
              <Link
              to="/about"
              className="hover:text-yellow-600 transition-colors"
            >
              About
            </Link>
            <Link to="/faq" className="hover:text-yellow-600 transition-colors">
            FAQ
          </Link>
          
             <Link
           to="/contact"
           className="hover:text-yellow-600 transition-colors"
          >
            Contact
          </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
