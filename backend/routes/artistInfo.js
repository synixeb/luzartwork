const express = require('express');
const router = express.Router();
const ArtistInfo = require('../models/ArtistInfo');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configuration multer pour la photo de l'artiste
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'artist-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Seules les images sont autorisées'));
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

// GET /api/artist-info - Récupérer les infos de l'artiste (public)
router.get('/', async (req, res) => {
  try {
    const artistInfo = await ArtistInfo.getSingleton();
    res.json(artistInfo);
  } catch (error) {
    console.error('Erreur lors de la récupération des infos artiste:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/artist-info - Mettre à jour les infos (protégé)
router.put('/', auth, upload.single('image'), [
  body('name').trim().notEmpty().withMessage('Le nom est requis'),
  body('bio').trim().notEmpty().withMessage('La biographie est requise')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const artistInfo = await ArtistInfo.getSingleton();
    
    artistInfo.name = req.body.name;
    artistInfo.bio = req.body.bio;
    
    // Si une nouvelle image est uploadée
    if (req.file) {
      // Supprimer l'ancienne image si elle existe et qu'elle n'est pas une URL externe
      if (artistInfo.imageUrl && !artistInfo.imageUrl.startsWith('http')) {
        await deleteFile(artistInfo.imageUrl);
      }
      artistInfo.imageUrl = '/uploads/' + req.file.filename;
    }
    
    // Parser le parcours si fourni en JSON string
    if (req.body.parcours) {
      try {
        artistInfo.parcours = JSON.parse(req.body.parcours);
      } catch (e) {
        console.error('Erreur parsing parcours:', e);
      }
    }
    
    artistInfo.updatedAt = Date.now();
    await artistInfo.save();
    
    res.json(artistInfo);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des infos artiste:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
