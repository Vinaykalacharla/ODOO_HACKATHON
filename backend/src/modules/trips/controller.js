import * as tripService from './service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const getAllTrips = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { trips, total } = await tripService.getTrips(req.user.id, page, limit);
    return sendSuccess(res, trips, 200, { page: parseInt(page), limit: parseInt(limit), total });
  } catch (err) {
    next(err);
  }
};

export const getTrip = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id, req.user.id);
    if (!trip) return sendError(res, 'Trip not found', 404);
    return sendSuccess(res, trip);
  } catch (err) {
    next(err);
  }
};

export const createTrip = async (req, res, next) => {
  try {
    const trip = await tripService.createTrip(req.user.id, req.body);
    return sendSuccess(res, trip, 201);
  } catch (err) {
    next(err);
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    const trip = await tripService.updateTrip(req.params.id, req.user.id, req.body);
    if (!trip) return sendError(res, 'Trip not found or unauthorized', 404);
    return sendSuccess(res, trip);
  } catch (err) {
    next(err);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    await tripService.deleteTrip(req.params.id, req.user.id);
    return sendSuccess(res, { message: 'Trip deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getCostSummary = async (req, res, next) => {
  try {
    const summary = await tripService.getTripCostSummary(req.params.id, req.user.id);
    if (!summary) return sendError(res, 'Cost summary not available', 404);
    return sendSuccess(res, summary);
  } catch (err) {
    next(err);
  }
};

export const toggleVisibility = async (req, res, next) => {
  try {
    const trip = await tripService.toggleVisibility(req.params.id, req.user.id);
    return sendSuccess(res, trip);
  } catch (err) {
    next(err);
  }
};
