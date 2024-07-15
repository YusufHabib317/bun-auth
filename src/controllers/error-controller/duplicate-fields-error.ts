import { httpCode } from '../../constants';
import { AppError, type AppErrorInstance } from '../../utils';

const handleDuplicateFieldsDB = (err:AppErrorInstance) => {
  const reg = /(["'])(\\?.)*?\1/;

  const value = err.errmsg?.match(reg)?.[0];

  const message = `Duplicated Field Value: ${value}. Please Use Other Value`;

  return new AppError(message, httpCode.NOT_FOUND);
};
export { handleDuplicateFieldsDB };
