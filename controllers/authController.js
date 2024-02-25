/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const createToken = (id) =>
  jwt.sign({ userId: id }, process.env.SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRE,
  });

const createSendToken = (user, res, statusCode) => {
  const token = createToken(user._id);
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ), // 90 days in milliseconds
  });
  res.status(statusCode).json({
    status: 'Success',
    token,
    user,
  });
};

exports.signup = async (req, res, next) => {
  // create user
  // validate password
  // encrypt password
  // generate token
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
    });

    // const token = createToken(user._id);
    // res.status(201).json({
    //   status: 'Success',
    //   token,
    //   user,
    // });
    createSendToken(user, res, 201);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  // GET the email and password from body
  const { email, password } = req.body;
  // check that if email and password is present

  if (!email || !password) {
    return next(new AppError('Please provide Passord and Email ', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  // check that the user and password is correct
  if (!user || !(await user.checkPassword(password, user.password))) {
    next(new AppError('Invalid password or email', 400));
  }
  // check that the password is hiddenin DB and compare that hidden password with encrypted one
  // create token
  // const token = createToken(user._id);

  // send token

  // res.status(200).json({
  //   status: 'Success',
  //   token,
  // });

  createSendToken(user, res, 200);
};

// Getting token and check its there
// validate the token
// check user if its still exists
// check if user changed password after the JWT token is issued

exports.protect = async (req, res, next) => {
  // Getting token and check if its there

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Access denied token is not found', 401));
  }

  // Validate the token

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.userId;

    // check if the user still exists
    const user = await User.findById(req.userId);

    if (!user) {
      return next(new AppError('User not found', 401));
    }

    // check if user changed password after the JWT token is issued

    if (user.passwordChangedAfter(decoded.iat)) {
      return next(
        new AppError('User has changed its password. Please log in again', 401),
      );
    }
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

exports.restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not allowed to mutate data', 402));
    }
    next();
  };
};

// get user based on the posted email
// generate random reset token
// send it to the user

exports.forgetPassword = async (req, res, next) => {
  // get user based on the posted email
  const { email } = req.body;

  const user = await User.findOne({ email });
  try {
    if (!user) {
      return next(new AppError('User is not found here'), 404);
    }
    // generate random reset token
    const resetToken = user.resetToken();

    await user.save({ validateBeforeSave: false });

    // send it to the user through email

    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
    next();
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500,
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  // get user based on the token
  // if the token has not expired and there is user, set the new password
  // update changedPasswordAt for the user
  // log the user in send JWT

  //  passwordResetToken

  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // const token = createToken(user._id);

    // send token

    // res.status(200).json({
    //   status: 'Success',
    //   token,
    // });

    createSendToken(user, res, 200);

    next();
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  // get the user from collection
  // check if posted current password is correct
  // if so update password
  // log user in send jwt
  const { currentPassword, newPassword, newConfirmPassword } = req.body;
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user || !(await user.checkPassword(currentPassword, user.password))) {
      next(new AppError('Invalid password or email', 400));
    }

    user.password = newPassword;
    user.passwordConfirm = newConfirmPassword;

    await user.save();

    // const token = createToken(user._id);

    // res.status(200).json({
    //   status: 'success',
    //   token,
    // });

    createSendToken(user, res, 200);
  } catch (err) {
    next(err);
  }
};
