const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['peinture', 'sculpture', 'dessin', 'photographie', 'digital', 'autre'],
    default: 'autre'
  },
  year: {
    type: Number
  },
  dimensions: {
    type: String
  },
  technique: {
    type: String
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Artwork', artworkSchema);
