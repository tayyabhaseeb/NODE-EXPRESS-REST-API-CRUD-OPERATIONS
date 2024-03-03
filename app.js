/* eslint-disable import/no-extraneous-dependencies */
const morgan = require('morgan');
const express = require('express');

const app = express();
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');

const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

//! Security HTTP headers middleware
app.use(helmet());
//! Middleware for cookie
app.use(cookieParser());

//! Middleware for rate limiter
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: 'To many requests for this api please try again in an hour',
});
app.use('/api', limiter);

// ! MIDDLE WARE (ALWAYS PLACE MIDDLE WARE AT TOP LEVEL (BEFORE ROUTES))
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//! Mongo Sanitize
app.use(mongoSanitize());
// !XSS attacks
app.use(xss());
// ! MIDDLE WARE ADDS DATE TO THE REQUEST
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//! prevent parameter pollution

app.use(
  hpp({
    whitelist: ['duration'],
  }),
);

// !  3rd Party Middleware

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ! MOUNTING A ROUTER ON ROUTES

// This is a middleware as well (below one)

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

// * SERVER LISTEN

module.exports = app;
