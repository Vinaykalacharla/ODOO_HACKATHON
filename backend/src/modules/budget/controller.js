import * as budgetService from './service.js';
import { sendSuccess } from '../../utils/response.js';

export const listBudget = async (req, res, next) => {
  try {
    const entries = await budgetService.getBudgetEntries(req.params.id);
    return sendSuccess(res, entries);
  } catch (err) {
    next(err);
  }
};

export const addEntry = async (req, res, next) => {
  try {
    const entry = await budgetService.createBudgetEntry(req.params.id, req.body);
    return sendSuccess(res, entry, 201);
  } catch (err) {
    next(err);
  }
};

export const updateEntry = async (req, res, next) => {
  try {
    const entry = await budgetService.updateBudgetEntry(req.params.entryId, req.params.id, req.body);
    return sendSuccess(res, entry);
  } catch (err) {
    next(err);
  }
};

export const deleteEntry = async (req, res, next) => {
  try {
    await budgetService.deleteBudgetEntry(req.params.entryId, req.params.id);
    return sendSuccess(res, { message: 'Budget entry deleted' });
  } catch (err) {
    next(err);
  }
};
