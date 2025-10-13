const express = require('express');
const router = express.Router();
const ContactInfo = require('../models/ContactInfo');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// GET /api/contact-info - Récupérer les infos de contact (public)
router.get('/', async (req, res) => {
  try {
    const contactInfo = await ContactInfo.getSingleton();
    res.json(contactInfo);
  } catch (error) {
    console.error('Erreur lors de la récupération des infos de contact:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/contact-info - Mettre à jour les infos de contact (protégé)
router.put('/', auth, [
  body('email').isEmail().withMessage('Email invalide'),
  body('phone').optional().trim(),
  body('address').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contactInfo = await ContactInfo.getSingleton();
    
    contactInfo.email = req.body.email;
    contactInfo.phone = req.body.phone || '';
    contactInfo.address = req.body.address || '';
    
    // Mettre à jour les réseaux sociaux
    if (req.body.social) {
      contactInfo.social = {
        instagram: req.body.social.instagram || '',
        facebook: req.body.social.facebook || '',
        twitter: req.body.social.twitter || '',
        linkedin: req.body.social.linkedin || ''
      };
    }
    
    contactInfo.updatedAt = Date.now();
    await contactInfo.save();
    
    res.json(contactInfo);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des infos de contact:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
