import Joi from 'joi';

export const signupSchema = Joi.object({
  name: Joi.string().trim().max(100).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(8).pattern(new RegExp('(?=.*[a-zA-Z])(?=.*[0-9])')).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one letter and one number'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().required()
});
