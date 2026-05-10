import Joi from 'joi';

export const addActivitySchema = Joi.object({
  activity_id: Joi.number().integer().required(),
  scheduled_date: Joi.date().iso().allow(null),
  scheduled_time: Joi.string().pattern(new RegExp('^([01]\\d|2[0-3]):?([0-5]\\d)$')).allow(null),
  actual_cost_override: Joi.number().min(0).allow(null),
  is_confirmed: Joi.number().valid(0, 1).default(0)
});
