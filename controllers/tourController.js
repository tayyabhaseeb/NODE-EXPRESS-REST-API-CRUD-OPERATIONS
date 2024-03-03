/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-unused-vars */
const Tour = require('../models/tourModel');
const { filter, sort, paginate, projection } = require('../utils/apiUtils');

const AppError = require('../utils/appError');

exports.readAllTour = async (req, res, next) => {
  try {
    let dbQuery = Tour.find();
    dbQuery = filter(dbQuery, req.query);
    dbQuery = sort(dbQuery, req.query);
    dbQuery = paginate(dbQuery, req.query);
    dbQuery = projection(dbQuery, req.query);

    const tours = await dbQuery;

    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.readSpecificTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('reviews');

    if (!tour) {
      return next(new AppError('The item with this id is not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.createNewTour = async (req, res, next) => {
  try {
    const createTour = new Tour(req.body);
    const saveTour = await createTour.save();
    res.status(201).json({
      status: 'success',
      data: {
        tour: saveTour,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTour = async (req, res, next) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // ?
    });

    if (!updatedTour) {
      return next(new AppError('The item with this id is not found', 404));
    }
    res.status(200).json({
      status: 'success',
      message: 'successfully Dispatch',
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndRemove(req.params.id);

    if (!tour) {
      return next(new AppError('The item with this id is not found', 404));
    }

    res.status(204).json({
      status: 'success',
      message: 'Data deleted ',
    });
  } catch (err) {
    next(err);
  }
};

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
        tours: { $push: '$name' },
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
