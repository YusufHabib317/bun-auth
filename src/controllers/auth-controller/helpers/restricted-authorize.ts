import type { NextFunction, Response } from 'express';
import type { CustomRequest } from '../../../types';
import { AppError } from '../../../utils/app-error';
import { httpCode } from '../../../constants';

const restrictedAuthorize = (roles:string[]) => (req:CustomRequest, res:Response, next:NextFunction) => {
  if (!req.user || !req.user.role) {
    const errMsg = 'Authentication required or user role not set';
    return next(new AppError(errMsg, httpCode.UNAUTHORIZED));
  }
  if (!roles.includes(req.user?.role)) {
    const errMsg = 'You Dont Have Permission To Get Access!';
    return next(new AppError(errMsg, httpCode.FORBIDDEN));
  }
  return next();
};
export { restrictedAuthorize };
