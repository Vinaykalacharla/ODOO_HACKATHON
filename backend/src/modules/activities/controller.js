import * as activityService from './service.js';
import { sendSuccess } from '../../utils/response.js';

export const addActivity = async (req, res, next) => {
  try {
    const activity = await activityService.addActivityToStop(req.params.stopId, req.body);
    return sendSuccess(res, activity, 201);
  } catch (err) {
    next(err);
  }
};

export const removeActivity = async (req, res, next) => {
  try {
    await activityService.removeActivityFromStop(req.params.stopId, req.params.taId);
    return sendSuccess(res, { message: 'Activity removed from stop' });
  } catch (err) {
    next(err);
  }
};

export const updateActivity = async (req, res, next) => {
  try {
    const activity = await activityService.updateTripActivity(req.params.stopId, req.params.taId, req.body);
    return sendSuccess(res, activity);
  } catch (err) {
    next(err);
  }
};

export const listCityActivities = async (req, res, next) => {
  try {
    const { category, maxCost } = req.query;
    const activities = await activityService.getCityActivities(req.params.id, category, maxCost);
    return sendSuccess(res, activities);
  } catch (err) {
    next(err);
  }
};
