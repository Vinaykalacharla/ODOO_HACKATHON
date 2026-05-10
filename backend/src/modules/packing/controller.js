import * as packingService from './service.js';
import { sendSuccess } from '../../utils/response.js';

export const listPacking = async (req, res, next) => {
  try {
    const items = await packingService.getPackingItems(req.params.id);
    return sendSuccess(res, items);
  } catch (err) {
    next(err);
  }
};

export const addItem = async (req, res, next) => {
  try {
    const item = await packingService.createPackingItem(req.params.id, req.body);
    return sendSuccess(res, item, 201);
  } catch (err) {
    next(err);
  }
};

export const toggleItem = async (req, res, next) => {
  try {
    const item = await packingService.toggleItemPacked(req.params.itemId, req.params.id);
    return sendSuccess(res, item);
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    await packingService.deletePackingItem(req.params.itemId, req.params.id);
    return sendSuccess(res, { message: 'Packing item deleted' });
  } catch (err) {
    next(err);
  }
};
