import Joi from 'joi';

export const packingItemSchema = Joi.object({
  label: Joi.string().trim().max(200).required(),
  category: Joi.string().valid('clothing','documents','electronics','toiletries','misc').required(),
  is_packed: Joi.number().valid(0, 1).default(0)
});
