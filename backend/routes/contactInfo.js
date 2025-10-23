const express = require('express');
const router = express.Router();
const contactInfoController = require('../controllers/contactInfoController');
const auth = require('../middleware/auth');
const { contactInfoValidation } = require('../middleware/validation');
const { catchAsync } = require('../middleware/errorHandler');

// @route   GET /api/contact-info
// @desc    Get contact information
// @access  Public
router.get('/', catchAsync(contactInfoController.getContactInfo));

// @route   PUT /api/contact-info
// @desc    Update contact information
// @access  Private (admin)
router.put(
  '/',
  auth,
  contactInfoValidation,
  catchAsync(contactInfoController.updateContactInfo)
);

module.exports = router;
