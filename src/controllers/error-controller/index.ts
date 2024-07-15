/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import type { NextFunction, Request, Response } from 'express';
import { ErrorName, httpCode } from '../../constants';
import type { AppErrorInstance } from '../../utils';
import { handleCastErrorDB } from './cast-error';
import { errorDev, errorPro } from './send-error';
import { handleDuplicateFieldsDB } from './duplicate-fields-error';
import { handleValidationDB } from './validation-error';
import { handleJwtDB } from './jwt-error';
import { handleTokenExpiredDB } from './token-expired-error';

const processError = (error: AppErrorInstance): AppErrorInstance => {
  let processedError: AppErrorInstance = { ...error };

  if ('path' in processedError && 'value' in processedError && processedError.name === ErrorName.CAST_ERROR) {
    processedError = handleCastErrorDB(processedError);
  }
  if ('code' in processedError && processedError.code === 11000) {
    processedError = handleDuplicateFieldsDB(processedError);
  }
  if (processedError.name === ErrorName.VALIDATION_ERROR) {
    processedError = handleValidationDB(processedError);
  }
  if (processedError.name === ErrorName.JSONWEBTOKEN_ERROR) {
    processedError = handleJwtDB();
  }
  if (processedError.name === ErrorName.TOKEN_EXPIRED_ERROR) {
    processedError = handleTokenExpiredDB();
  }

  return processedError;
};

const handleDevelopmentError = (res: Response, error: AppErrorInstance) => {
  errorDev(res, error);
};

const handleProductionError = (res: Response, error: AppErrorInstance) => {
  const processedError = processError(error);
  errorPro(res, processedError);
};

const errorController = (err: AppErrorInstance, req: Request, res: Response, next:NextFunction): void => {
  const error: AppErrorInstance = {
    ...err,
    statusCode: err.statusCode || httpCode.INTERNAL_SERVER_ERROR,
    status: err.status || 'error',
  };

  if (process.env.NODE_ENV === 'development') {
    handleDevelopmentError(res, error);
  } else if (process.env.NODE_ENV === 'production') {
    handleProductionError(res, error);
  }
};

export { errorController };
