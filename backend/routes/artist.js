const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const ArtistInfo = require('../models/ArtistInfo');
const auth = require('../middleware/auth');

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Fonction pour supprimer un fichier
async function deleteFile(filePath) {
  try {
    if (filePath && !filePath.startsWith('http')) {
      const fullPath = path.join(__dirname, '..', filePath);
      await fs.unlink(fullPath);
      console.log(`Fichier supprimé: ${fullPath}`);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
  }
}

// Mise à jour des informations de l'artiste
router.put('/', auth, upload.single('image'), async (req, res) => {
  try {
    let artistInfo = await ArtistInfo.findOne();
    
    if (!artistInfo) {
      artistInfo = new ArtistInfo();
    }

    const oldImageUrl = artistInfo.imageUrl;

    artistInfo.name = req.body.name || artistInfo.name;
    artistInfo.bio = req.body.bio || artistInfo.bio;
    
    if (req.body.parcours) {
      artistInfo.parcours = JSON.parse(req.body.parcours);
    }

    if (req.file) {
      artistInfo.imageUrl = `/uploads/${req.file.filename}`;
      // Supprimer l'ancienne image
      await deleteFile(oldImageUrl);
    }

    const updatedInfo = await artistInfo.save();
    res.json(updatedInfo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;