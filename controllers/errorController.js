/* eslint-disable node/no-unsupported-features/es-syntax */

const AppError = require('../utils/appError');

const errorInDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const errorInProduction = (err, res) => {
  if (err.isOperation) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Some thing want very wrong',
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDublicateDB = (err) => {
  const message = `The tour: ${err.keyValue.name} already exits`;
  return new AppError(message, 400);
};
const handleValidationError = (err) => {
  const message = Object.values(err.errors)
    .map((ele) => ele.message)
    .join('.');
  return new AppError(message, 400);
};

const jsonWebTokkenError = () => new AppError('Invalid token error', 401);
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const tokenExpiredError = () => new AppError('Token is expired', 401);

  if (process.env.NODE_ENV === 'development') {
    errorInDevelopment(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // MONGODB ERRORS
    if (err.name === 'CastError') {
      err = handleCastErrorDB(err);
    }

    if (err.code === 11000) {
      err = handleDublicateDB(err);
    }

    if (err.name === 'ValidationError') {
      err = handleValidationError(err);
    }

    if (err.name === 'JsonWebTokenError') {
      err = jsonWebTokkenError();
    }

    if (err.name === 'TokenExpiredError') {
      err = tokenExpiredError();
    }
    errorInProduction(err, res);
  }
};
