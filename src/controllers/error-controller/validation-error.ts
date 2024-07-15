import { httpCode } from '../../constants';
import { AppError, type AppErrorInstance } from '../../utils';

const handleValidationDB = (err:AppErrorInstance) => {
  if (!err.errors) {
    return new AppError('Undefined validation errors.', httpCode.BAD_REQUEST);
  }
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid Input Data.${errors.join('. ')}`;

  return new AppError(message, httpCode.NOT_FOUND);
};
export { handleValidationDB };
