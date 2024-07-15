/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { httpCode } from '../../constants';
import { User } from '../../models';
import type { IUser } from '../../types';
import { catchAsync } from '../../utils';

const deleteMe = catchAsync(async (req, res, next) => {
  const { id } = req.user as IUser;

  await User.findByIdAndUpdate(
    id,
    {
      isActive: false,
    },
  );

  return res.status(httpCode.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
});

export { deleteMe };
