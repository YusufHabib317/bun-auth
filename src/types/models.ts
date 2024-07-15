import { Document } from 'mongoose';

export enum UserRole {
  Admin = 'admin',
  Vendor = 'vendor',
  Customer = 'customer',
}

export interface IUser extends Document {
  name: string;
  photo?: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  passwordChangeAt?: Date | null;
  role: UserRole;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | undefined;
  isActive: boolean;
  isVerified: boolean;
  '2FASecret': string;
  correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
  changePasswordAfter(jwtTimestamp:number): Promise<boolean>;
  createPasswordResetToken(): string;
}
