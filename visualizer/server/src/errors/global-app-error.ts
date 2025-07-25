import { Request, Response, NextFunction } from 'express';
import { AppError } from './app-error';
import { config } from '../../config';

interface MongoError extends Error {
  path?: string;
  value?: any;
  code?: number;
  errmsg?: string;
  errors?: { [key: string]: { message: string } };
}

interface AppErrorExtended extends AppError {
  name: string;
  code?: number;
}

const handleCastErrorDB = (err: MongoError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: MongoError): AppError => {
  const value = err.errmsg!.match(/(["'])(\\?.)*?\1/)![0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: MongoError): AppError => {
  const errors = Object.values(err.errors!).map((el: { message: string }) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (): AppError =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = (): AppError =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err: AppError, req: Request, res: Response): void => {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
};

const sendErrorProd = (err: AppError, req: Request, res: Response): void => {
    if (err.isOperational) {
            res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
        return;
    }
    console.error('ERROR 💥', err);
    res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!'
    });
};

export default (err: AppErrorExtended, req: Request, res: Response, next: NextFunction): void => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.nodeEnv === 'development') {
    sendErrorDev(err, req, res);
  } else if (config.nodeEnv === 'production') {
    let error: AppErrorExtended = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
