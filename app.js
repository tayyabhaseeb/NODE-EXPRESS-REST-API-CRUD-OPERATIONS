const morgan = require('morgan');
const express = require('express');

const app = express();

const tourRouter = require('./routes/tourRoutes');

const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

// ! MIDDLE WARE (ALWAYS PLACE MIDDLE WARE AT TOP LEVEL (BEFORE ROUTES))
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ! MIDDLE WARE ADDS DATE TO THE REQUEST
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

// !  3rd Party Middleware

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ! MOUNTING A ROUTER ON ROUTES

// This is a middleware as well (below one)

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

// * SERVER LISTEN

// ! Get (Read)
// app.get('/api/v1/tours', readAllTour);
//! GET REQUEST WITH ID (ROUTES)
// app.get('/api/v1/tours/:id', readSpecificTour);
//  ! POST REQUEST //
// middleware ==> modify the request data
// middleware means in the middle ==> between client and server
// middlewares are used to manipulate the requests and responses
// app.post('/api/v1/tours', createNewTour);
// ! PATCH THE API
// app.patch('/api/v1/tours/:id', updateTour);
// ! DELETE FROM THE API
// app.delete('/api/v1/tours/:id', deleteTour);

module.exports = app;
