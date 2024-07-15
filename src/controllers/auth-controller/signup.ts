import { catchAsync } from '../../utils';
import { User } from '../../models';

const signup = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    passwordConfirm,
  } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  req.user = newUser;

  return next();
});

export { signup };
