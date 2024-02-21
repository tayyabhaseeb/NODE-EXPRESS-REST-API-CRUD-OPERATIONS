const express = require('express');

const router = express.Router();

const {
  getAllUsers,
  createNewUser,
  getSpecificUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const { signup, login } = require('../controllers/authController');

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/').get(getAllUsers).post(createNewUser);
router.route('/:id').get(getSpecificUser).patch(updateUser).delete(deleteUser);

module.exports = router;
