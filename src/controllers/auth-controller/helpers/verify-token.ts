import jwt from 'jsonwebtoken';
import { httpCode } from '../../../constants';
import { AppError } from '../../../utils';

interface TokenPayload {
    id: string;
    iat: number;
}
const verifyToken = (token: string | undefined | null, secret: string): Promise<TokenPayload> => new Promise((resolve, reject) => {
  jwt.verify(token!, secret, (err, decoded) => {
    if (err) {
      reject(new AppError('Invalid token or token expired', httpCode.UNAUTHORIZED));
    } else {
      resolve(decoded as TokenPayload);
    }
  });
});
export { verifyToken };
