import * as stopService from './service.js';
import { sendSuccess } from '../../utils/response.js';

export const getTripStops = async (req, res, next) => {
  try {
    const stops = await stopService.getStops(req.params.id);
    return sendSuccess(res, stops);
  } catch (err) {
    next(err);
  }
};

export const addStop = async (req, res, next) => {
  try {
    const stop = await stopService.createStop(req.params.id, req.body);
    return sendSuccess(res, stop, 201);
  } catch (err) {
    next(err);
  }
};

export const updateStop = async (req, res, next) => {
  try {
    const stop = await stopService.updateStop(req.params.stopId, req.params.id, req.body);
    return sendSuccess(res, stop);
  } catch (err) {
    next(err);
  }
};

export const deleteStop = async (req, res, next) => {
  try {
    await stopService.deleteStop(req.params.stopId, req.params.id);
    return sendSuccess(res, { message: 'Stop deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const reorderStops = async (req, res, next) => {
  try {
    await stopService.reorderStops(req.params.id, req.body);
    return sendSuccess(res, { message: 'Stops reordered successfully' });
  } catch (err) {
    next(err);
  }
};
