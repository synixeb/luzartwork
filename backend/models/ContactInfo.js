const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  email: {
    type: String,
    default: 'contact@artiste.com'
  },
  address: {
    type: String,
    default: 'Auvergne - Rhône-Alpes, France'
  },
  social: {
    instagram: {
      type: String,
      default: 'luzartwork'
    },
    artstation: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Singleton pattern pour ContactInfo aussi
contactInfoSchema.statics.getSingleton = async function() {
  let contactInfo = await this.findOne();
  if (!contactInfo) {
    contactInfo = await this.create({
      email: 'contact@artiste.com',
      phone: '+33 6 12 34 56 78',
      address: 'Paris, France',
      social: {
        instagram: '@artiste',
        facebook: 'artiste.art'
      }
    });
  }
  return contactInfo;
};

module.exports = mongoose.model('ContactInfo', contactInfoSchema);
