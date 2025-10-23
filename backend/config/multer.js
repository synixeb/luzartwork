const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Créer le dossier uploads s'il n'existe pas
const ensureUploadsDir = async () => {
  try {
    await fs.mkdir('uploads', { recursive: true });
  } catch (error) {
    console.error('Erreur lors de la création du dossier uploads:', error);
  }
};

// Configuration du stockage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadsDir();
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const prefix = req.uploadPrefix || 'file';
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Filtre pour n'accepter que les images
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Seules les images (JPEG, PNG, GIF, WebP) sont autorisées'));
};

// Configuration multer pour les œuvres d'art
const artworkUpload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: imageFileFilter
});

// Configuration multer pour la photo de l'artiste
const artistUpload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: imageFileFilter
});

// Fonction utilitaire pour supprimer un fichier
const deleteFile = async (filePath) => {
  try {
    if (filePath && !filePath.startsWith('http')) {
      // Nettoyer le chemin (enlever le / du début si présent)
      const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
      const fullPath = path.join(__dirname, '..', cleanPath);
      await fs.unlink(fullPath);
      console.log(`✅ Fichier supprimé: ${fullPath}`);
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('❌ Erreur lors de la suppression du fichier:', error);
    }
  }
};

module.exports = {
  artworkUpload,
  artistUpload,
  deleteFile
};
