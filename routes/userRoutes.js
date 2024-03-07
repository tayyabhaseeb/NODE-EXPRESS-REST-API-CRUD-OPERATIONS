const express = require('express');

const router = express.Router();

const {
  getAllUsers,
  createNewUser,
  getSpecificUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controllers/userController');

const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require('../controllers/authController');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.post('/forgetPassword', forgetPassword);
router.route('/resetPassword/:token').patch(resetPassword);

router.use(protect); // this middleware adds protect to every route below it

router.route('/updatePassword').patch(updatePassword);
router.route('/updateMe').patch(updateMe);
router.route('/deleteMe').delete(deleteMe);
router.get('/me', getMe, getSpecificUser);

router.use(restrictTo('admin')); // only admin can get the data about users

router.route('/').get(getAllUsers).post(createNewUser);
router.route('/:id').get(getSpecificUser).patch(updateUser).delete(deleteUser);

module.exports = router;
