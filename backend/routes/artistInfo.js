const express = require('express');
const router = express.Router();
const artistInfoController = require('../controllers/artistInfoController');
const { artistUpload } = require('../config/multer');
const auth = require('../middleware/auth');
const { artistInfoValidation } = require('../middleware/validation');
const { catchAsync } = require('../middleware/errorHandler');

// Set upload prefix for artist photos
const setArtistPrefix = (req, res, next) => {
  req.uploadPrefix = 'artist';
  next();
};

// @route   GET /api/artist-info
// @desc    Get artist information
// @access  Public
router.get('/', catchAsync(artistInfoController.getArtistInfo));

// @route   PUT /api/artist-info
// @desc    Update artist information
// @access  Private (admin)
router.put(
  '/',
  auth,
  setArtistPrefix,
  artistUpload.single('image'),
  artistInfoValidation,
  catchAsync(artistInfoController.updateArtistInfo)
);

module.exports = router;
