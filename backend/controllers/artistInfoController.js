const ArtistInfo = require('../models/ArtistInfo');
const { deleteFile } = require('../config/multer');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get artist information
// @route   GET /api/artist-info
// @access  Public
exports.getArtistInfo = async (req, res, next) => {
  const artistInfo = await ArtistInfo.getSingleton();
  
  // Retourner directement l'objet pour compatibilité frontend
  res.status(200).json(artistInfo);
};

// @desc    Update artist information
// @route   PUT /api/artist-info
// @access  Private (admin)
exports.updateArtistInfo = async (req, res, next) => {
  const artistInfo = await ArtistInfo.getSingleton();
  
  const oldImageUrl = artistInfo.imageUrl;

  // Update fields
  artistInfo.name = req.body.name;
  artistInfo.bio = req.body.bio;
  
  // Handle new image upload
  if (req.file) {
    artistInfo.imageUrl = `/uploads/${req.file.filename}`;
    // Delete old image if not an external URL
    if (oldImageUrl && !oldImageUrl.startsWith('http')) {
      await deleteFile(oldImageUrl);
    }
  }
  
  // Parse and update parcours if provided
  if (req.body.parcours) {
    try {
      artistInfo.parcours = typeof req.body.parcours === 'string' 
        ? JSON.parse(req.body.parcours) 
        : req.body.parcours;
    } catch (error) {
      return next(new AppError('Format du parcours invalide', 400));
    }
  }
  
  artistInfo.updatedAt = Date.now();
  const updatedInfo = await artistInfo.save();
  
  // Retourner directement l'objet pour compatibilité frontend
  res.status(200).json(updatedInfo);
};
