import express from 'express';
import {
  signup,
  login,
  refreshToken,
  generate2FA,
  validate2FA,
} from '../controllers';

const authRouter = express.Router();

authRouter.route('/signup').post(signup, generate2FA);

authRouter.route('/2fa/validate').post(validate2FA);

authRouter.route('/login').post(login);

authRouter.route('/refresh-token').get(refreshToken);

export { authRouter };
