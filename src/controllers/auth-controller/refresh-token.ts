/* eslint-disable no-underscore-dangle */
import { AppError, catchAsync } from '../../utils';
import { httpCode } from '../../constants';
import { UserRefreshToken } from '../../models';
import { setTokenCookie, signToken, verifyToken } from './helpers';

const refreshToken = catchAsync(async (req, res, next) => {
  let rToken:string | undefined | null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    [, rToken] = req.headers.authorization.split(' ');
  }
  if (!rToken) {
    const errMsg = 'Refresh Token Not Found';
    const error = new AppError(errMsg, httpCode.UNAUTHORIZED);
    return next(error);
  }

  const decodedToken = await verifyToken(rToken, process.env.REFRESH_SECRET_KEY!);

  const userRefreshToken = await UserRefreshToken.findOne({
    refreshToken: rToken,
    userId: decodedToken.id,
  });

  if (!userRefreshToken) {
    const errMsg = 'Refresh Token Invalid Or Expired';
    const error = new AppError(errMsg, httpCode.UNAUTHORIZED);
    return next(error);
  }

  await UserRefreshToken.findByIdAndDelete(userRefreshToken?._id);

  const newAccessToken = signToken(
    decodedToken.id as string,
    process.env.SECRET_KEY!,
    process.env.accessTokenExpireIn!,
  );

  const newRefreshToken = signToken(
    decodedToken.id!,
    process.env.REFRESH_SECRET_KEY!,
    process.env.refreshTokenExpireIn!,
  );

  setTokenCookie(
    res,
    newAccessToken,
    process.env.accessTokenExpireIn,
  );

  setTokenCookie(
    res,
    newRefreshToken,
    process.env.refreshTokenExpireIn,
  );

  await UserRefreshToken.create({
    userId: decodedToken.id,
    refreshToken: newRefreshToken,
    expiresAt: new Date(Date.now() + parseInt(process.env.refreshTokenExpireIn!, 10) * 60 * 1000),
  });

  return res.status(httpCode.SUCCESS).json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

export { refreshToken };
