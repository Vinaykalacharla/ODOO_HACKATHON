import Joi from 'joi';

export const noteSchema = Joi.object({
  stop_id: Joi.string().uuid().allow(null),
  content: Joi.string().trim().required()
});
