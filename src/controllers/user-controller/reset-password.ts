/* eslint-disable no-underscore-dangle */
import { httpCode } from '../../constants';
import { User, UserRefreshToken } from '../../models';
import { AppError, catchAsync } from '../../utils';
import crypto from 'crypto';
import { signToken } from '../auth-controller';
import { setTokenCookie } from '../auth-controller/helpers';

const resetPassword = catchAsync(async (req, res, next) => {
  const { token: hashedToken } = req.params;
  const { password, passwordConfirm } = req.body;

  const hashedCrypto = crypto.createHash('sha256').update(hashedToken).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedCrypto,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    const errMsg = 'Token Is Invalid Or Has Expired';
    return next(new AppError(errMsg, httpCode.BAD_REQUEST));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = signToken(user._id as string, process.env.SECRET_KEY!, process.env.accessTokenExpireIn!);

  const refreshToken = signToken(user._id as string, process.env.REFRESH_SECRET_KEY!, process.env.refreshTokenExpireIn!);

  setTokenCookie(res, token, process.env.accessTokenExpireIn);

  setTokenCookie(res, refreshToken, process.env.refreshTokenExpireIn);

  await UserRefreshToken.create({
    userId: user._id,
    refreshToken,
    expiresAt: new Date(Date.now() + parseInt(process.env.refreshTokenExpireIn!, 10) * 60 * 1000),
  });
  return res.status(httpCode.SUCCESS).json({
    status: 'success',
    token,
    refreshToken,
    data: {
      user,
    },
  });
});

export { resetPassword };
