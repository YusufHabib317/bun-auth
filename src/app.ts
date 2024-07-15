/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { authRouter, userRouter } from './routes';
import { httpCode } from './constants';
import { AppError } from './utils';
import { errorController } from './controllers';

const app = express();

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too any Request! Please Try Again In Hour',
});

app.use('/api', limiter);

app.use(helmet());

app.use(express.json({
  limit: '10kb',
}));

app.use(mongoSanitize());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.DATABASE_URL as string)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
  const errMessage = `Can Not Find ${req.originalUrl} On This Server`;
  const err = new AppError(errMessage, httpCode.NOT_FOUND);
  next(err);
});

app.use(errorController);

export default app;
