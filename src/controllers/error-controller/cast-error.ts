import { httpCode } from '../../constants';
import { AppError, type AppErrorInstance } from '../../utils';

const handleCastErrorDB = (error: AppErrorInstance) => {
  const message = `Invalid ${error.path || 'path'}: ${error.value || 'value'}`;
  return new AppError(message, httpCode.NOT_FOUND);
};
export { handleCastErrorDB };
