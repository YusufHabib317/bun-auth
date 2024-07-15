/* eslint-disable no-console */
import type { Response } from 'express';
import type { AppErrorInstance } from '../../utils';
import { httpCode } from '../../constants';

const errorDev = (res:Response, err:AppErrorInstance) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const errorPro = (res:Response, err:AppErrorInstance) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error 💥:', err);
    res.status(httpCode.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something Went Wrong!',
    });
  }
};
export { errorDev, errorPro };
