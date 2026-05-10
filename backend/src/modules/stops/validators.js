import Joi from 'joi';

export const createStopSchema = Joi.object({
  city_id: Joi.number().integer().required(),
  arrival_date: Joi.date().iso().required(),
  departure_date: Joi.date().iso().min(Joi.ref('arrival_date')).required(),
  stop_order: Joi.number().integer().min(0).required(),
  notes: Joi.string().trim().allow('', null)
});

export const reorderStopsSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().uuid().required(),
    stop_order: Joi.number().integer().min(0).required()
  })
).unique('stop_order');
