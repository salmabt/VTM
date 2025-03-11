// backend/middleware/isAdmin.js
const createError = require('../utils/appError'); // Importez votre utilitaire d'erreur

const isAdmin = (req, res, next) => {
  // Vérifier si l'utilisateur est connecté et a le rôle d'admin
  if (req.user && req.user.role === 'admin') {
    next(); // L'utilisateur est un admin, passer à la prochaine étape
  } else {
    return next(new createError('Unauthorized: Only admin can perform this action.', 403));
  }
};

module.exports = isAdmin; // Exportez le middleware