const Artwork = require('../models/Artwork');
const { deleteFile } = require('../config/multer');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all artworks
// @route   GET /api/artworks
// @access  Public
exports.getAllArtworks = async (req, res, next) => {
  const artworks = await Artwork.find().sort({ order: 1, createdAt: -1 });
  
  // Retourner directement le tableau pour compatibilité frontend
  res.status(200).json(artworks);
};

// @desc    Get single artwork
// @route   GET /api/artworks/:id
// @access  Public
exports.getArtwork = async (req, res, next) => {
  const artwork = await Artwork.findById(req.params.id);
  
  if (!artwork) {
    return next(new AppError('Œuvre non trouvée', 404));
  }
  
  // Retourner directement l'objet pour compatibilité frontend
  res.status(200).json(artwork);
};

// @desc    Create new artwork
// @route   POST /api/artworks
// @access  Private (admin)
exports.createArtwork = async (req, res, next) => {
  const artworkData = {
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl,
    category: req.body.category,
    year: req.body.year,
    dimensions: req.body.dimensions,
    technique: req.body.technique,
    price: req.body.price,
    isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true,
    order: req.body.order || 0
  };

  // Vérifier qu'une image est fournie
  if (!artworkData.imageUrl) {
    return next(new AppError('Une image est requise', 400));
  }

  const artwork = await Artwork.create(artworkData);

  // Retourner directement l'objet pour compatibilité frontend
  res.status(201).json(artwork);
};

// @desc    Update artwork
// @route   PUT /api/artworks/:id
// @access  Private (admin)
exports.updateArtwork = async (req, res, next) => {
  const artwork = await Artwork.findById(req.params.id);
  
  if (!artwork) {
    return next(new AppError('Œuvre non trouvée', 404));
  }

  const oldImageUrl = artwork.imageUrl;

  // Mise à jour des champs
  artwork.title = req.body.title || artwork.title;
  artwork.description = req.body.description !== undefined ? req.body.description : artwork.description;
  artwork.category = req.body.category || artwork.category;
  artwork.year = req.body.year || artwork.year;
  artwork.dimensions = req.body.dimensions !== undefined ? req.body.dimensions : artwork.dimensions;
  artwork.technique = req.body.technique !== undefined ? req.body.technique : artwork.technique;
  artwork.price = req.body.price !== undefined ? req.body.price : artwork.price;
  artwork.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : artwork.isAvailable;
  artwork.order = req.body.order !== undefined ? req.body.order : artwork.order;

  // Si nouvelle image uploadée
  if (req.file) {
    artwork.imageUrl = `/uploads/${req.file.filename}`;
    // Supprimer l'ancienne image
    if (oldImageUrl && !oldImageUrl.startsWith('http')) {
      await deleteFile(oldImageUrl);
    }
  } else if (req.body.imageUrl) {
    artwork.imageUrl = req.body.imageUrl;
  }

  const updatedArtwork = await artwork.save();

  // Retourner directement l'objet pour compatibilité frontend
  res.status(200).json(updatedArtwork);
};

// @desc    Delete artwork
// @route   DELETE /api/artworks/:id
// @access  Private (admin)
exports.deleteArtwork = async (req, res, next) => {
  const artwork = await Artwork.findById(req.params.id);
  
  if (!artwork) {
    return next(new AppError('Œuvre non trouvée', 404));
  }

  // Supprimer le fichier image
  await deleteFile(artwork.imageUrl);

  await artwork.deleteOne();

  // Retourner message de succès pour compatibilité frontend
  res.status(200).json({ message: 'Œuvre supprimée avec succès' });
};
