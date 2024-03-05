const express = require('express');

const router = express.Router({ mergeParams: true });

const { protect, restrictTo } = require('../controllers/authController');
const {
  readAllReview,
  createNewReview,
  deleteReview,
  updateReview,
  addUserTourId,
  readSpecificReview,
} = require('../controllers/reviewController');

router
  .route('/')
  .get(protect, readAllReview)
  .post(protect, restrictTo('user'), addUserTourId, createNewReview);

router
  .route('/:id')
  .delete(deleteReview)
  .patch(updateReview)
  .get(readSpecificReview);

module.exports = router;
