import mongoose, { Schema } from 'mongoose';

const userRefreshTokenSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

userRefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const UserRefreshToken = mongoose.model(
  'UserRefreshToken',
  userRefreshTokenSchema,
);

export { UserRefreshToken };
