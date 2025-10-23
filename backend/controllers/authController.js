const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

// Fonction pour générer un JWT
const signToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Fonction pour créer et envoyer le token
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user);

  // Retourner le format attendu par le frontend
  res.status(statusCode).json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
};

// @desc    Register new admin user
// @route   POST /api/auth/register
// @access  Public (should be protected in production)
exports.register = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return next(new AppError('Un utilisateur avec cet email ou nom d\'utilisateur existe déjà', 400));
  }

  // Create new user
  const user = await User.create({
    username,
    email,
    password,
    role: 'admin'
  });

  createSendToken(user, 201, res);
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  // Find user
  const user = await User.findOne({ username }).select('+password');
  
  if (!user) {
    return next(new AppError('Identifiants invalides', 401));
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);
  
  if (!isPasswordCorrect) {
    return next(new AppError('Identifiants invalides', 401));
  }

  createSendToken(user, 200, res);
};

// @desc    Update username
// @route   PUT /api/auth/update-username
// @access  Private
exports.updateUsername = async (req, res, next) => {
  const { currentPassword, newUsername } = req.body;

  if (!currentPassword || !newUsername) {
    return next(new AppError('Mot de passe et nouvel identifiant requis', 400));
  }

  // Find user
  const user = await User.findById(req.user.userId).select('+password');
  
  if (!user) {
    return next(new AppError('Utilisateur non trouvé', 404));
  }

  // Verify current password
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  
  if (!isPasswordCorrect) {
    return next(new AppError('Mot de passe incorrect', 401));
  }

  // Check if new username already exists
  const existingUser = await User.findOne({ username: newUsername });
  if (existingUser && existingUser._id.toString() !== user._id.toString()) {
    return next(new AppError('Ce nom d\'utilisateur est déjà utilisé', 400));
  }

  // Update username
  user.username = newUsername;
  await user.save();

  createSendToken(user, 200, res);
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Mot de passe actuel et nouveau mot de passe requis', 400));
  }

  // Find user
  const user = await User.findById(req.user.userId).select('+password');
  
  if (!user) {
    return next(new AppError('Utilisateur non trouvé', 404));
  }

  // Verify current password
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  
  if (!isPasswordCorrect) {
    return next(new AppError('Mot de passe actuel incorrect', 401));
  }

  // Update password (will be hashed by pre-save hook)
  user.password = newPassword;
  await user.save();

  // Retourner message simple pour compatibilité frontend
  res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  
  if (!user) {
    return next(new AppError('Utilisateur non trouvé', 404));
  }

  // Retourner format compatible frontend
  res.status(200).json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
};
