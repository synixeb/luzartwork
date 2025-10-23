const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');
const {
  loginValidation,
  registerValidation,
  updatePasswordValidation,
  updateUsernameValidation
} = require('../middleware/validation');

// @route   POST /api/auth/register
// @desc    Register admin user (should be protected in production)
// @access  Public (change to protected after first admin creation)
router.post('/register', registerValidation, catchAsync(authController.register));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, catchAsync(authController.login));

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, catchAsync(authController.getMe));

// @route   PUT /api/auth/update-username
// @desc    Update username
// @access  Private
router.put('/update-username', auth, updateUsernameValidation, catchAsync(authController.updateUsername));

// @route   PUT /api/auth/update-password
// @desc    Update password
// @access  Private
router.put('/update-password', auth, updatePasswordValidation, catchAsync(authController.updatePassword));

module.exports = router;
