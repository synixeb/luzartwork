const ContactInfo = require('../models/ContactInfo');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get contact information
// @route   GET /api/contact-info
// @access  Public
exports.getContactInfo = async (req, res, next) => {
  const contactInfo = await ContactInfo.getSingleton();
  
  // Retourner directement l'objet pour compatibilité frontend
  res.status(200).json(contactInfo);
};

// @desc    Update contact information
// @route   PUT /api/contact-info
// @access  Private (admin)
exports.updateContactInfo = async (req, res, next) => {
  const contactInfo = await ContactInfo.getSingleton();
  
  // Update main fields
  contactInfo.email = req.body.email;
  contactInfo.phone = req.body.phone || '';
  contactInfo.address = req.body.address || '';
  
  // Update social media links
  if (req.body.social) {
    contactInfo.social = {
      instagram: req.body.social.instagram || '',
      facebook: req.body.social.facebook || '',
      twitter: req.body.social.twitter || '',
      linkedin: req.body.social.linkedin || ''
    };
  }
  
  contactInfo.updatedAt = Date.now();
  const updatedInfo = await contactInfo.save();
  
  // Retourner directement l'objet pour compatibilité frontend
  res.status(200).json(updatedInfo);
};
