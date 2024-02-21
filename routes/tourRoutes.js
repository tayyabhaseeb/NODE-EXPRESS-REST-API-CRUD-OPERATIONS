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

const { protect } = require('../controllers/authController');

const cheapToursMiddleWare = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = 'price, -ratingsAverage';
  next();
};

router.route('/').get(protect, readAllTour).post(createNewTour);
router.route('/top-5-cheap-tours').get(cheapToursMiddleWare, readAllTour);

router.route('/general-data-insights').get(insightData);
router.route('/busiest-month/:year').get(busyMonth);

router.route('/:id').get(readSpecificTour).patch(updateTour).delete(deleteTour);

module.exports = router;
