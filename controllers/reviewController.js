const Review = require('../models/reviewModel');

exports.readAllReview = async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const reviews = await Review.find(filter);

    res.status(200).json({
      status: 'Success',
      results: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createNewReview = async (req, res, next) => {
  try {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    const createReview = new Review(req.body);
    const saveReview = await createReview.save();
    res.status(201).json({
      status: 'success',
      data: {
        tour: saveReview,
      },
    });
  } catch (err) {
    next(err);
  }
};
