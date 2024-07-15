/* eslint-disable func-names */
import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { UserRole, type IUser } from '../types';

const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: [true, 'Please Enter Your Name'],
  },
  email: {
    type: String,
    required: [true, 'Please Enter Your Email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please Enter Valid Email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please Enter Your Password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Confirm Your Password'],
    validate: {
      validator(this: IUser) {
        return this.passwordConfirm === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.Customer,
  },
  passwordChangeAt: {
    type: Date || null,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  '2FASecret': {
    type: String,
    default: '',
    select: false,
  },
});

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  return next();
});
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangeAt = new Date(Date.now() - 1000);
  return next();
});

userSchema.methods.correctPassword = async function (this: IUser, candidatePassword: string, userPassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (this: IUser, jwtIAT: number): boolean {
  if (this.passwordChangeAt) {
    const changedTimestamp = parseInt((this.passwordChangeAt.getTime() / 1000).toString(), 10);
    return jwtIAT < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function (this: IUser): string {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const expirationDuration = 10 * 60 * 1000;

  this.passwordResetExpires = new Date(Date.now() + expirationDuration);

  return resetToken;
};

const User = mongoose.model<IUser>('User', userSchema);

export { User };
