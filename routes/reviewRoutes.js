const express = require('express');

const router = express.Router({ mergeParams: true });

const { protect, restrictTo } = require('../controllers/authController');
const {
  readAllReview,
  createNewReview,
} = require('../controllers/reviewController');

router
  .route('/')
  .get(protect, readAllReview)
  .post(protect, restrictTo('user'), createNewReview);

module.exports = router;
