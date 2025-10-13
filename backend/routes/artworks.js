const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Artwork = require('../models/Artwork');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'artwork-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Seules les images sont autorisées!'));
  }
});

// Fonction pour supprimer un fichier
async function deleteFile(filePath) {
  try {
    if (filePath && !filePath.startsWith('http')) {
      const fullPath = path.join(__dirname, '..', filePath);
      await fs.unlink(fullPath);
      console.log(`✅ Ancienne image supprimée: ${fullPath}`);
    }
  } catch (error) {
    // Si le fichier n'existe pas, ce n'est pas grave
    if (error.code !== 'ENOENT') {
      console.error('❌ Erreur lors de la suppression du fichier:', error);
    }
  }
}

// @route   GET /api/artworks
// @desc    Get all artworks
// @access  Public
router.get('/', async (req, res) => {
  try {
    const artworks = await Artwork.find().sort({ order: 1, createdAt: -1 });
    res.json(artworks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   GET /api/artworks/:id
// @desc    Get artwork by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    
    if (!artwork) {
      return res.status(404).json({ message: 'Œuvre non trouvée' });
    }
    
    res.json(artwork);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Œuvre non trouvée' });
    }
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   POST /api/artworks
// @desc    Create new artwork
// @access  Private (admin only)
router.post('/', auth, upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Le titre est requis'),
  body('imageUrl').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

    const artwork = new Artwork(artworkData);
    await artwork.save();

    res.status(201).json(artwork);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// @route   PUT /api/artworks/:id
// @desc    Update artwork
// @access  Private (admin only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    
    if (!artwork) {
      return res.status(404).json({ message: 'Œuvre non trouvée' });
    }

    const oldImageUrl = artwork.imageUrl;

    // Mise à jour des champs
    artwork.title = req.body.title || artwork.title;
    artwork.description = req.body.description || artwork.description;
    artwork.category = req.body.category || artwork.category;
    artwork.year = req.body.year || artwork.year;
    artwork.dimensions = req.body.dimensions || artwork.dimensions;
    artwork.technique = req.body.technique || artwork.technique;
    artwork.price = req.body.price !== undefined ? req.body.price : artwork.price;
    artwork.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : artwork.isAvailable;
    artwork.order = req.body.order !== undefined ? req.body.order : artwork.order;

    // Si nouvelle image uploadée
    if (req.file) {
      artwork.imageUrl = `/uploads/${req.file.filename}`;
      // Supprimer l'ancienne image si elle n'est pas une URL externe
      if (oldImageUrl && !oldImageUrl.startsWith('http')) {
        await deleteFile(oldImageUrl);
      }
    } else if (req.body.imageUrl) {
      artwork.imageUrl = req.body.imageUrl;
    }

    const updatedArtwork = await artwork.save();
    res.json(updatedArtwork);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/artworks/:id
// @desc    Delete artwork
// @access  Private (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    
    if (!artwork) {
      return res.status(404).json({ message: 'Œuvre non trouvée' });
    }

    // Supprimer le fichier image
    await deleteFile(artwork.imageUrl);

    await artwork.deleteOne();
    res.json({ message: 'Œuvre supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
