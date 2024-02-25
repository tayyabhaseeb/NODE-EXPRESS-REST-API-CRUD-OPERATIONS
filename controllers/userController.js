const AppError = require('../utils/appError');
const User = require('../models/userModel');

const filterObj = (obj, ...properties) => {
  const newObj = {};
  Object.keys(obj).forEach((ele) => {
    if (properties.includes(ele)) newObj[ele] = obj[ele];
  });
  return newObj;
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: 'success',
      users,
    });
  } catch (err) {
    next(err);
  }
};

exports.createNewUser = (req, res) => {
  res.status(500).json({
    status: 'Fail',
    message: 'Internal Server Error',
  });
};

exports.getSpecificUser = (req, res) => {
  res.status(500).json({
    status: 'Fail',
    message: 'Internal Server Error',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Fail',
    message: 'Internal Server Error',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Fail',
    message: 'Internal Server Error',
  });
};

exports.updateMe = async (req, res, next) => {
  // body password ==> error
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('You  cannot set password in this route'), 400);
    }

    const updatedBody = filterObj(req.body, 'name', 'email');

    const user = await User.findByIdAndUpdate(req.user._id, updatedBody, {
      new: true,
      runValidators: true, // ?
    });

    res.status(200).json({
      message: 'update Me route',
      user,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};
