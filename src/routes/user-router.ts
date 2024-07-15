import express from 'express';
import {
  allUsers,
  // forgotPassword,
  isAuth,
  // resetPassword,
  updateMe,
  updatePassword,
  deleteMe,
} from '../controllers';

const userRouter = express.Router();

// userRouter.route('/forgot-password').post(isAuth, forgotPassword);

// userRouter.route('/reset-password/:token').patch(resetPassword);

userRouter.route('/change-password').patch(isAuth, updatePassword);

userRouter.route('/update-me').patch(isAuth, updateMe);

userRouter.route('/delete-me').delete(isAuth, deleteMe);

userRouter.route('/all').get(isAuth, allUsers);

export { userRouter };
