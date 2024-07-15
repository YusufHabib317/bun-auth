/* eslint-disable no-underscore-dangle */
import { AppError, catchAsync } from '../../utils';
import { User, UserRefreshToken } from '../../models';
import { httpCode } from '../../constants';
import { setTokenCookie, signToken } from './helpers';

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const message = 'Please Provide Name And Password';
    const error = new AppError(message, httpCode.UNPROCESSABLE_CONTENT);
    return next(error);
  }

  const user = await User.findOne({
    email,
  }).select('+password');

  const correct = await user?.correctPassword(password, user.password);

  if (!user || !correct) {
    const message = 'Incorrect Email Or Password';
    const error = new AppError(message, httpCode.UNAUTHORIZED);
    return next(error);
  }

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

export { login };
