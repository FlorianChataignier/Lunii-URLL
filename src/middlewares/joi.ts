import { RequestHandler } from 'express';
import Joi from 'joi';

const middleware =
  (schema: Joi.ObjectSchema, validateParams: boolean = false): RequestHandler =>
  (req, res, next) => {
    const { error } = schema.validate(validateParams ? req.params : req.body);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');

      console.log('error', message);
      res.status(422).json({ error: message });
    }
  };

export const joiMiddleware = middleware;
