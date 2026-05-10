import { verifyToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';

/**
 * Authentication middleware
 * Verifies JWT from httpOnly cookie or Authorization header
 */
export const auth = (req, res, next) => {
  try {
    const token = req.cookies.accessToken || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return sendError(res, 'Access denied. No token provided.', 401);
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired token', 401);
  }
};
