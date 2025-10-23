// Classe d'erreur personnalisée
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware pour les routes non trouvées
const notFound = (req, res, next) => {
  const error = new AppError(`Route non trouvée: ${req.originalUrl}`, 404);
  next(error);
};

// Gestionnaire d'erreurs pour Mongoose
const handleCastErrorDB = (err) => {
  const message = `ID invalide: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : 'valeur';
  const message = `Champ dupliqué: ${value}. Veuillez utiliser une autre valeur`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Données invalides: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Erreur JWT
const handleJWTError = () => 
  new AppError('Token invalide. Veuillez vous reconnecter', 401);

const handleJWTExpiredError = () =>
  new AppError('Token expiré. Veuillez vous reconnecter', 401);

// Erreur Multer
const handleMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('Le fichier est trop volumineux. Taille max: 5MB', 400);
  }
  return new AppError(err.message, 400);
};

// Envoi des erreurs en développement
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Envoi des erreurs en production
const sendErrorProd = (err, res) => {
  // Erreur opérationnelle connue: envoyer le message au client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } 
  // Erreur de programmation: ne pas divulguer les détails
  else {
    console.error('💥 ERREUR:', err);
    res.status(500).json({
      status: 'error',
      message: 'Une erreur est survenue'
    });
  }
};

// Middleware global de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Gestion des erreurs spécifiques
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (err.name === 'MulterError') error = handleMulterError(err);

    sendErrorProd(error, res);
  }
};

// Wrapper pour les fonctions async (évite les try-catch)
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  AppError,
  notFound,
  errorHandler,
  catchAsync
};
