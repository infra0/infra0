import Joi from 'joi';
import httpStatus from 'http-status';
import { pick } from 'lodash'
import { AppError } from '../errors/app-error';
import { Request, Response, NextFunction } from 'express';

const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema.describe().keys, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  
  const { value, error } = schema.validate(object, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessage = error.details.map((details: Joi.ValidationErrorItem) => details.message).join(', ');
    return next(new AppError(errorMessage, httpStatus.BAD_REQUEST));
  }

  Object.assign(req, value);
  return next();
};

export default validate;