import { catchAsync } from '../../utils';
import { User } from '../../models';
import { httpCode } from '../../constants';

const allUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(httpCode.SUCCESS).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});

export { allUsers };
