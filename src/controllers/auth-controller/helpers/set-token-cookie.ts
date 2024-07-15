import { type Response } from 'express';

interface CookieOptions {
  expires: Date;
  httpOnly: boolean;
  secure: boolean;
}

const setTokenCookie = (res: Response, token: string, cookieExpireIn?: string | undefined): void => {
  const expireTime = cookieExpireIn ? parseInt(cookieExpireIn, 10) : parseInt(process.env.accessTokenCookieExpireIn!, 10);

  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + expireTime * 60 * 1000),
    httpOnly: true,
    secure: false,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);
};

export { setTokenCookie };
