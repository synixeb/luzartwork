const { body, validationResult } = require('express-validator');

// Middleware pour vérifier les résultats de validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'fail',
      errors: errors.array() 
    });
  }
  next();
};

// Validateurs pour l'authentification
const loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Le nom d\'utilisateur est requis'),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis'),
  validate
];

const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores'),
  body('email')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 7 }).withMessage('Le mot de passe doit contenir au moins 7 caractères')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule')
    .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une minuscule')
    .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre'),
  validate
];

const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Le mot de passe actuel est requis'),
  body('newPassword')
    .isLength({ min: 7 }).withMessage('Le nouveau mot de passe doit contenir au moins 7 caractères')
    .matches(/[A-Z]/).withMessage('Le nouveau mot de passe doit contenir au moins une majuscule')
    .matches(/[a-z]/).withMessage('Le nouveau mot de passe doit contenir au moins une minuscule')
    .matches(/[0-9]/).withMessage('Le nouveau mot de passe doit contenir au moins un chiffre'),
  validate
];

const updateUsernameValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Le mot de passe actuel est requis'),
  body('newUsername')
    .trim()
    .isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores'),
  validate
];

// Validateurs pour les œuvres d'art
const artworkValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Le titre est requis')
    .isLength({ min: 2, max: 200 }).withMessage('Le titre doit contenir entre 2 et 200 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('La description ne peut pas dépasser 2000 caractères'),
  body('category')
    .optional()
    .isIn(['peinture', 'sculpture', 'dessin', 'photographie', 'digital', 'autre'])
    .withMessage('Catégorie invalide'),
  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Année invalide'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('L\'ordre doit être un nombre entier positif'),
  validate
];

// Validateurs pour les informations de l'artiste
const artistInfoValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('bio')
    .trim()
    .notEmpty().withMessage('La biographie est requise')
    .isLength({ min: 10, max: 5000 }).withMessage('La biographie doit contenir entre 10 et 5000 caractères'),
  validate
];

// Validateurs pour les informations de contact
const contactInfoValidation = [
  body('email')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
    .withMessage('Numéro de téléphone invalide'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('L\'adresse ne peut pas dépasser 500 caractères'),
  body('social.instagram')
    .optional()
    .trim(),
  body('social.facebook')
    .optional()
    .trim(),
  body('social.twitter')
    .optional()
    .trim(),
  body('social.linkedin')
    .optional()
    .trim(),
  validate
];

module.exports = {
  loginValidation,
  registerValidation,
  updatePasswordValidation,
  updateUsernameValidation,
  artworkValidation,
  artistInfoValidation,
  contactInfoValidation
};
