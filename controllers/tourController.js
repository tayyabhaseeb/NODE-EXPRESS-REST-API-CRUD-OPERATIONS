/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-unused-vars */
const Tour = require('../models/tourModel');

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

exports.readAllTour = getAll(Tour);
exports.readSpecificTour = getOne(Tour, 'reviews');
exports.createNewTour = createOne(Tour);
exports.deleteTour = deleteOne(Tour);
exports.updateTour = updateOne(Tour);

exports.insightData = async (req, res, next) => {
  try {
    const tours = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.5 },
        },
      },
      {
        $group: {
          _id: '$difficulty',

          numTours: { $sum: 1 },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$ratingsAverage' },
          maxGroupSize: { $max: '$maxGroupSize' },
        },
      },
      {
        $sort: {
          avgRating: -1,
        },
      },
    ]);
    res.status(200).json({
      status: 'success',
      length: tours.length,
      message: 'successfully Dispatch',
      data: {
        tours,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.busyMonth = async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $unwind: '$startDates',
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStart: { $sum: 1 },
        tours: { $push: '$name' }, // this gives the array of tour names
      },
    },

    {
      $sort: {
        numTourStart: -1,
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  try {
    res.status(200).json({
      status: 'success',
      length: plan.length,
      message: 'successfully Dispatch',
      data: {
        plan,
      },
    });
  } catch (err) {
    next(err);
  }
};
