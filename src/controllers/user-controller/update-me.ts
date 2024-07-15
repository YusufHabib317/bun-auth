/* eslint-disable no-underscore-dangle */
import { httpCode } from '../../constants';
import { User } from '../../models';
import type { IUser } from '../../types';
import { AppError, catchAsync } from '../../utils';

const updateMe = catchAsync(async (req, res, next) => {
  const {
    password,
    confirmPassword,
    role,
    email,
    name,
  } = req.body;

  const { id } = req.user as IUser;

  if (password || confirmPassword || role) {
    const message = 'If You Need To Update Password Use This Route: /change-password';
    const error = new AppError(message, httpCode.BAD_REQUEST);
    return next(error);
  }
  if (!name || !email) {
    const message = 'Please Provide Name And Email';
    const error = new AppError(message, httpCode.BAD_REQUEST);
    return next(error);
  }

  const newUser = await User.findByIdAndUpdate(
    id,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return res.status(httpCode.SUCCESS).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

export { updateMe };
