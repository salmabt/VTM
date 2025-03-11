// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const createError = require('../utils/appError');

const authMiddleware = (req, res, next) => {
  // Récupérer le token de l'en-tête Authorization
  const token = req.headers.authorization?.split(' ')[1]; // Format : "Bearer <token>"

  if (!token) {
    return next(new createError('No token provided. Access denied.', 401));
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter les informations de l'utilisateur à req.user
    req.user = decoded; // decoded contient { id, role, ... } (ce que vous avez inclus dans le token lors de la connexion)
    next(); // Passer au middleware ou à la route suivante
  } catch (error) {
    return next(new createError('Invalid or expired token.', 401));
  }
};

module.exports = authMiddleware;