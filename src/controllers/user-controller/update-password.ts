/* eslint-disable no-underscore-dangle */
import { httpCode } from '../../constants';
import { User } from '../../models';
import { AppError, catchAsync } from '../../utils';
import { signToken } from '../auth-controller';
import type { IUser } from '../../types';

const updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword, newConfirmPassword } = req.body;

  if (!oldPassword || !newPassword || !newConfirmPassword) {
    const message = 'Please Provide Old Password  And New Password And Confirm Password';
    const error = new AppError(message, httpCode.BAD_REQUEST);
    return next(error);
  }

  const { id } = req.user as Omit<IUser, 'correctPassword' | 'changePasswordAfter'>;

  const user = await User.findOne({
    _id: id,
  }).select('+password');

  if (!user) {
    const errMsg = 'Token Is Invalid Or Has Expired';
    return next(new AppError(errMsg, httpCode.BAD_REQUEST));
  }

  const correct = await user?.correctPassword(oldPassword, user.password);

  if (!correct) {
    const message = 'Incorrect Email Or Password';
    const error = new AppError(message, httpCode.UNAUTHORIZED);
    return next(error);
  }

  user.password = newPassword;
  user.passwordConfirm = newConfirmPassword;
  await user.save();

  const token = signToken(user._id as string, process.env.SECRET_KEY as string);

  return res.status(httpCode.SUCCESS).json({
    status: 'success',
    token,
  });
});

export { updatePassword };
