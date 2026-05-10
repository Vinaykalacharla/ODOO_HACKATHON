import { sendError } from '../utils/response.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);

  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors = null;

  // Handle specific errors
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation Error';
    errors = err.details;
  } else if (err.name === 'UnauthorizedError' || err.message === 'Unauthorized') {
    statusCode = 401;
    message = 'Unauthorized access';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  return sendError(res, err.message || message, statusCode, errors);
};
