import Joi from 'joi';

export const createTripSchema = Joi.object({
  title: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().allow('', null),
  cover_image_url: Joi.string().uri().trim().allow('', null),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().min(Joi.ref('start_date')).required(),
  total_budget: Joi.number().min(0).default(0),
  is_public: Joi.number().valid(0, 1).default(0),
  status: Joi.string().valid('draft', 'planned', 'ongoing', 'completed').default('draft')
});

export const updateTripSchema = createTripSchema.fork(['title', 'start_date', 'end_date'], (schema) => schema.optional());
