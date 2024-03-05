const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const { filter, sort, paginate, projection } = require('../utils/apiUtils');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndRemove(req.params.id);

    if (!doc) {
      return next(new AppError('The document with this id is not found', 404));
    }

    res.status(204).json({
      status: 'success',
      message: 'Data deleted ',
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // ?
    });

    if (!doc) {
      return next(new AppError('The document with this id is not found', 404));
    }
    res.status(200).json({
      status: 'success',
      message: 'successfully Dispatch',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const createDoc = new Model(req.body);
    const saveDoc = await createDoc.save();
    res.status(201).json({
      status: 'success',
      data: {
        data: saveDoc,
      },
    });
  });

exports.getOne = (Model, populateOption) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOption) {
      query = query.populate(populateOption);
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError('The document with this id is not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // Filter reviews by tourID in reviews controller

    let filterByTourIdInReviews = {};
    if (req.params.tourId)
      filterByTourIdInReviews = { tour: req.params.tourId };
    // end here
    let dbQuery = Model.find(filterByTourIdInReviews);
    dbQuery = filter(dbQuery, req.query);
    dbQuery = sort(dbQuery, req.query);
    dbQuery = paginate(dbQuery, req.query);
    dbQuery = projection(dbQuery, req.query);

    const doc = await dbQuery;

    res.status(200).json({
      status: 'Success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
