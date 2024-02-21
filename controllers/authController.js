/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const createToken = (id) =>
  jwt.sign({ userId: id }, process.env.SECRET_KEY, {
    expiresIn: process.env.TOKEN_EXPIRE,
  });

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
    });

    const token = createToken(user._id);
    res.status(201).json({
      status: 'Success',
      token,
      user,
    });
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
  const token = createToken(user._id);

  // send token

  res.status(200).json({
    status: 'Success',
    token,
  });
};

exports.protect = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    next(new AppError('Access denied token is not found'));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded.userId;

    const user = User.findById(req.user);

    if (!user) {
      return new AppError('User is not found', 401);
    }

    next();
  } catch (err) {
    next(err);
  }
};
