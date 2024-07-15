/* eslint-disable consistent-return */
import { httpCode } from '../../../constants';
import { User } from '../../../models';
import type { IUser } from '../../../types';
import { AppError } from '../../../utils/app-error';
import { catchAsync } from '../../../utils/catch-async';
import { verifyToken } from './verify-token';

const isAuth = catchAsync(async (req, res, next) => {
  let token: string | null | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    [, token] = req.headers.authorization.split(' ');
  }

  if (!token) {
    const message = 'You Not Login! Please Login To Get Access';
    const error = new AppError(message, httpCode.UNAUTHORIZED);
    return next(error);
  }

  const decodedToken = await verifyToken(token, process.env.REFRESH_SECRET_KEY!);

  const currentUser: IUser | null = await User.findById(decodedToken.id);

  if (!currentUser) {
    const message = 'The User Belonging To This Token No Longer Exists.';
    const error = new AppError(message, httpCode.UNAUTHORIZED);
    return next(error);
  }

  if (await currentUser?.changePasswordAfter(decodedToken.iat)) {
    const message = 'User Recently Changed Password!, Please Login Again';
    const error = new AppError(message, httpCode.UNAUTHORIZED);
    return next(error);
  }

  if (currentUser) {
    req.user = currentUser;
  }

  next();
});

export { isAuth };
