import * as cityService from './service.js';
import { sendSuccess } from '../../utils/response.js';

export const listCities = async (req, res, next) => {
  try {
    const { search, country, page = 1, limit = 20 } = req.query;
    const { cities, total } = await cityService.getCities(search, country, page, limit);
    return sendSuccess(res, cities, 200, { page: parseInt(page), limit: parseInt(limit), total });
  } catch (err) {
    next(err);
  }
};
