/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import { httpCode } from '../../constants';
import { User, UserRefreshToken } from '../../models';
import { AppError, catchAsync } from '../../utils';
import { authenticator } from 'otplib';
import { setTokenCookie, signToken, verifyToken } from './helpers';

const validate2FA = catchAsync(async (req, res, next) => {
  let token:string | undefined | null;

  const { totp } = req.body;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    [, token] = req.headers.authorization.split(' ');
  }

  if (!totp) {
    const message = 'TOTP Require';
    const error = new AppError(message, httpCode.NO_CONTENT);
    return next(error);
  }

  const decodedToken = await verifyToken(token, process.env.SECRET_KEY!);

  const user = await User.findOne({
    _id: decodedToken.id,
  }).select('+2FASecret');

  if (!user || !user['2FASecret']) {
    const message = 'User not found or 2FA secret missing';
    const error = new AppError(message, httpCode.NO_CONTENT);
    return next(error);
  }

  const verified = authenticator.verify({ token: totp, secret: user?.['2FASecret'] as string });

  if (!verified) {
    const message = 'TOTP Not Valid Or Expired';
    const error = new AppError(message, httpCode.BAD_REQUEST);
    return next(error);
  }

  await user.updateOne({
    $set: {
      isVerified: true,
    },
  });
  const newToken = signToken(user._id as string, process.env.SECRET_KEY!, process.env.accessTokenExpireIn!);

  const refreshToken = signToken(user._id as string, process.env.REFRESH_SECRET_KEY!, process.env.refreshTokenExpireIn!);

  setTokenCookie(res, newToken, process.env.accessTokenExpireIn);

  setTokenCookie(res, refreshToken, process.env.refreshTokenExpireIn);

  await UserRefreshToken.create({
    userId: user._id,
    refreshToken,
    expiresAt: new Date(Date.now() + parseInt(process.env.refreshTokenExpireIn!, 10) * 60 * 1000),
  });

  return res.status(httpCode.SUCCESS).json({
    status: 'success',
    message: 'TOTP Validated Successfully ',
    token: newToken,
    refreshToken,
    data: {
      user,
    },
  });
});

export { validate2FA };
