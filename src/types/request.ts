import type { Request } from 'express';
import type { IUser } from './models';

export interface CustomRequest extends Request {
     user?: Omit<IUser, 'correctPassword' | 'changePasswordAfter'>;
}
