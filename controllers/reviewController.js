const Review = require('../models/reviewModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

exports.addUserTourId = (req, res, next) => {
  // This is a middleware for createNewReview
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.readAllReview = getAll(Review);
exports.deleteReview = deleteOne(Review);
exports.updateReview = updateOne(Review);
exports.createNewReview = createOne(Review);
exports.readSpecificReview = getOne(Review);
