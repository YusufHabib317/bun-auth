import { httpCode } from '../../constants';
import { AppError } from '../../utils';

const handleTokenExpiredDB = () => {
  const message = 'Token Expired';
  return new AppError(message, httpCode.NOT_FOUND);
};
export { handleTokenExpiredDB };
