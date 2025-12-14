import { AppError } from '../utils/error.js';

export const validateSubscription = (req, res, next) => {
  const { username, email, phone, description } = req.body;

  if (!username || username.trim().length === 0) {
    return next(new AppError('Username is required', 400));
  }

  if (!email || !isValidEmail(email)) {
    return next(new AppError('Valid email is required', 400));
  }

  if (!phone || !isValidPhone(phone)) {
    return next(new AppError('Valid phone number is required', 400));
  }

  if (!description || description.trim().length === 0) {
    return next(new AppError('Description is required', 400));
  }

  if (description.length < 10) {
    return next(new AppError('Description must be at least 10 characters', 400));
  }

  if (description.length > 2000) {
    return next(new AppError('Description must be less than 2000 characters', 400));
  }

  next();
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};