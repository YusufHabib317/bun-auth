/* eslint-disable max-params */
class AppError extends Error {
  statusCode: number;

  status: string;

  isOperational: boolean;

  code?: number;

  path?: string;

  value?: string;

  errmsg?: string;

  errors?: { [key: string]: { message: string } };

  constructor(
    message: string,
    statusCode: number,
    code?: number,
    path?: string,
    value?: string,
    errmsg?: string,
    errors?: { [key: string]: { message: string } },
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.code = code;
    this.path = path;
    this.value = value;
    this.errmsg = errmsg;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError };
export type AppErrorInstance = AppError;
