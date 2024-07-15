import jwt from 'jsonwebtoken';

const signToken = (id:string, secretKey:string, expireTime:string):string => jwt.sign(
  { id },
  secretKey,
  {
    expiresIn: expireTime,
    subject: 'AccessApi',
  },
);

export { signToken };
