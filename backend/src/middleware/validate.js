import { sendError } from '../utils/response.js';

/**
 * Joi validation middleware
 * @param {Object} schema Joi schema
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true,
      errors: { wrap: { label: false } }
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));
      return sendError(res, 'Validation Failed', 422, errors);
    }

    next();
  };
};
