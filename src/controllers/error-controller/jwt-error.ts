import { httpCode } from '../../constants';
import { AppError } from '../../utils';

const handleJwtDB = () => {
  const message = 'Invalid Token Please Login Again!';

  return new AppError(message, httpCode.UNAUTHORIZED);
};
export { handleJwtDB };
