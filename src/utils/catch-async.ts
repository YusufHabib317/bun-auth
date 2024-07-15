import type { Response, NextFunction } from 'express';
import type { CustomRequest } from '../types';

type AsyncRequestHandler = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

const catchAsync = (fn: AsyncRequestHandler) => (req: CustomRequest, res: Response, next: NextFunction) => {
  fn(req, res, next).catch((err: unknown) => next(err));
};

export { catchAsync };
