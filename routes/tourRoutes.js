const express = require('express');

const router = express.Router();

const {
  readAllTour,
  createNewTour,
  readSpecificTour,
  updateTour,
  deleteTour,
  insightData,
  busyMonth,
} = require('../controllers/tourController');

const { protect, restrictTo } = require('../controllers/authController');

const reviewRouter = require('./reviewRoutes');

const cheapToursMiddleWare = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = 'price, -ratingsAverage';
  next();
};

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/')
  .get(readAllTour)
  .post(protect, restrictTo('admin', 'lead-guide'), createNewTour);
router.route('/top-5-cheap-tours').get(cheapToursMiddleWare, readAllTour);

router.route('/general-data-insights').get(insightData);
router
  .route('/busiest-month/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), busyMonth);

router
  .route('/:id')
  .get(readSpecificTour)
  .patch(updateTour, protect, restrictTo('admin', 'lead-guide'))
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
