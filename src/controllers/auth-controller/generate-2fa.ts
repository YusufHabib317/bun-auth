/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import { httpCode } from '../../constants';
import { User } from '../../models';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';

import {
  AppError,
  catchAsync,
  sendEmail,
} from '../../utils';
import { signToken } from './helpers';

const generate2FA = catchAsync(async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) {
    const message = 'User ID not found in request';
    const error = new AppError(message, httpCode.BAD_REQUEST);
    return next(error);
  }

  const user = await User.findById(userId);

  if (!user) {
    const message = 'User not found';
    const error = new AppError(message, httpCode.BAD_REQUEST);
    return next(error);
  }

  if (user.isVerified) {
    const message = 'User No Need Verifying';
    const error = new AppError(message, httpCode.BAD_REQUEST);
    return next(error);
  }

  const secret = authenticator.generateSecret();
  const uri = authenticator.keyuri(user.email, 'Test', secret);

  await user.updateOne({
    $set: {
      '2FASecret': secret,
    },
  });

  const qrCode = await qrcode.toBuffer(uri, { type: 'png', margin: 1 });

  await sendEmail({
    email: user.email,
    subject: 'Your 2FA QR Code',
    message: 'Scan the attached QR code with your authenticator app.',
    attachments: [{
      filename: '2fa-qrcode.png',
      content: qrCode,
    }],
  });

  const token = signToken(user._id as string, process.env.SECRET_KEY!, process.env.accessTokenExpireIn!);

  return res.status(httpCode.SUCCESS).json({
    status: 'success',
    message: '2FA setup email sent successfully.',
    token,
  });
});

export { generate2FA };
