import * as adminService from './service.js';
import { sendSuccess } from '../../utils/response.js';

export const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getStats();
    return sendSuccess(res, stats);
  } catch (err) {
    next(err);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { users, total } = await adminService.getUsers(page, limit);
    return sendSuccess(res, users, 200, { page: parseInt(page), limit: parseInt(limit), total });
  } catch (err) {
    next(err);
  }
};
