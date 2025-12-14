import config from '../config/config.js';

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.error('Error Handler:', {
    message: err.message,
    statusCode: err.statusCode,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });

  if (config.nodeEnv === 'development') {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      message: err.message,
      stack: err.stack,
      details: err,
    });
  } else {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    } else {
      console.error('ERROR:', err);
      res.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again later.',
      });
    }
  }
};