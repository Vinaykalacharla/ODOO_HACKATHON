/**
 * Send a success response
 */
export const sendSuccess = (res, data = {}, statusCode = 200, meta = null) => {
  return res.status(statusCode).json({
    success: true,
    data,
    error: null,
    meta
  });
};

/**
 * Send an error response
 */
export const sendError = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    error: message,
    errors
  });
};
