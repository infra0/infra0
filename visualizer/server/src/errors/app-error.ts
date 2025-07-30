export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  } 

export class DuplicateResourceError extends Error {
    constructor() {
        super("DB Resource already exists");
        Error.captureStackTrace(this, this.constructor);
    }
}