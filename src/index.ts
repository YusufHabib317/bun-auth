/* eslint-disable no-console */
import app from './app';

const server = app.listen(process.env.PORT, () => {
  console.log(`SERVER RUNNING ON SERVER ${process.env.PORT}`);
});

process.on('unhandledRejection', (err:Error) => {
  console.log('error name', err.name);
  console.log('error message', err.message);
  console.log('UNHANDLED REJECTION, SHUTTING DOWN!!');
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('error name', err.name);
  console.log('error message', err.message);
  console.log('Uncaught Exception, SHUTTING DOWN!!');
  server.close(() => {
    process.exit(1);
  });
});
