import { sendError } from '../utils/response.js';

/**
 * Admin authorization middleware
 * Checks if authenticated user has is_admin = 1
 */
export const adminGuard = (req, res, next) => {
  if (!req.user || req.user.is_admin !== 1) {
    return sendError(res, 'Access denied. Admin privileges required.', 403);
  }
  next();
};
