import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({ label, to, onClick, disabled, className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-8 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;