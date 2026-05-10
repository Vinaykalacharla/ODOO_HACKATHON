import Joi from 'joi';

export const budgetEntrySchema = Joi.object({
  category: Joi.string().valid('transport','accommodation','food','activities','misc').required(),
  label: Joi.string().trim().max(200).required(),
  amount: Joi.number().positive().required(),
  entry_date: Joi.date().iso().allow(null),
  is_estimated: Joi.number().valid(0, 1).default(1)
});
