const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    default: 'contact@artiste.com'
  },
  phone: {
    type: String,
    default: '+33 6 12 34 56 78'
  },
  address: {
    type: String,
    default: 'Paris, France'
  },
  social: {
    instagram: {
      type: String,
      default: '@artiste'
    },
    facebook: {
      type: String,
      default: 'artiste.art'
    },
    twitter: {
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
