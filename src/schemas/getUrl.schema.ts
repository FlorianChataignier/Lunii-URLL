import Joi from 'joi';

export const getUrlSchema = Joi.object({
  id: Joi.string().length(6).required()
});
