import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({ label, to }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-8 rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300"
    >
      {label}
    </button>
  );
};

export default Button;
