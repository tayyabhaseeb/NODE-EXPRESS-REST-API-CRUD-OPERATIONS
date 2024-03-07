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

router.use(protect);

router
  .route('/')
  .get(readAllReview)
  .post(restrictTo('user'), addUserTourId, createNewReview);

router
  .route('/:id')
  .delete(restrictTo('admin', 'user'), deleteReview)
  .patch(restrictTo('admin', 'user'), updateReview)
  .get(readSpecificReview);

module.exports = router;
