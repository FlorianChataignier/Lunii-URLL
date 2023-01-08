import Joi from 'joi';

export const addShortUrlSchema = Joi.object({
  url: Joi.string().uri().min(1).max(120).required()
});
