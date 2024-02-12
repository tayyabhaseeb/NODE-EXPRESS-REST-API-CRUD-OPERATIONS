/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);

  process.exit(1);
});
const app = require('./app');

const port = process.env.PORT || 4000;

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database is connected');
  });

const server = app.listen(port, () => {
  console.log('App is live at https:localhost:4000');
});

process.on('rejectionHandled', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// test
