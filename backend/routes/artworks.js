const express = require('express');
const router = express.Router();
const artworkController = require('../controllers/artworkController');
const { artworkUpload } = require('../config/multer');
const auth = require('../middleware/auth');
const { artworkValidation } = require('../middleware/validation');
const { catchAsync } = require('../middleware/errorHandler');

// Set upload prefix for artworks
const setArtworkPrefix = (req, res, next) => {
  req.uploadPrefix = 'artwork';
  next();
};

// Public routes
router.get('/', catchAsync(artworkController.getAllArtworks));
router.get('/:id', catchAsync(artworkController.getArtwork));

// Protected routes (admin only)
router.post(
  '/',
  auth,
  setArtworkPrefix,
  artworkUpload.single('image'),
  artworkValidation,
  catchAsync(artworkController.createArtwork)
);

router.put(
  '/:id',
  auth,
  setArtworkPrefix,
  artworkUpload.single('image'),
  catchAsync(artworkController.updateArtwork)
);

router.delete(
  '/:id',
  auth,
  catchAsync(artworkController.deleteArtwork)
);

module.exports = router;
