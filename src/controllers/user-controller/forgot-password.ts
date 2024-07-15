import { httpCode } from '../../constants';
import { User } from '../../models';
import { AppError, catchAsync, sendEmail } from '../../utils';

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    email,
  });

  if (!user) {
    const errMsg = 'There No User With Email Address';
    return next(new AppError(errMsg, httpCode.NOT_FOUND));
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/user/reset-password/${resetToken}`;

  let message = `Forgot Your Password? Submit a Patch Request With New Password And Confirm Password to: ${resetURL}`;

  message += '\n If You Did Not Forgot Your Password, Please Ignore The Email!';

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset Token (Valid For 10 Mins)',
      message,
    }).catch((err) => err);

    return res.status(httpCode.SUCCESS).json({
      status: 'success',
      message: 'Token Send To Email!',
    });
  } catch (error) {
    user.passwordResetToken = undefined;

    user.passwordResetToken = undefined;

    await user.save({ validateBeforeSave: false });

    const errMsg = 'There Was An Error Sending The Email. Try Again Later';

    return next(new AppError(errMsg, httpCode.INTERNAL_SERVER_ERROR));
  }
});

export { forgotPassword };
