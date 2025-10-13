const mongoose = require('mongoose');

const artistInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Nom de l\'Artiste'
  },
  bio: {
    type: String,
    required: true,
    default: 'Biographie de l\'artiste...'
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/400x500/10b981/ffffff?text=Photo+Artiste'
  },
  parcours: [{
    year: {
      type: String,
      required: true
    },
    event: {
      type: String,
      required: true
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Il ne devrait y avoir qu'un seul document ArtistInfo
// On utilise un singleton pattern
artistInfoSchema.statics.getSingleton = async function() {
  let artistInfo = await this.findOne();
  if (!artistInfo) {
    // Créer les données par défaut si elles n'existent pas
    artistInfo = await this.create({
      name: 'Manon Vérot',
      bio: 'Passionnée d\'art depuis mon plus jeune âge, j\'explore différentes techniques et styles pour exprimer ma vision du monde.',
      imageUrl: '/uploads/profilPicture.jpg',
      parcours: [
        { year: '2024', event: 'Exposition collective - Galerie d\'Art Moderne' },
        { year: '2023', event: 'Prix de la Jeune Création Artistique' },
        { year: '2022', event: 'Diplôme des Beaux-Arts de Paris' }
      ]
    });
  }
  return artistInfo;
};

module.exports = mongoose.model('ArtistInfo', artistInfoSchema);
