// middleware/auth.js
const jwt = require('jsonwebtoken');

// middleware/auth.js
module.exports = function(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) throw new Error('Token manquant');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userData = { 
        userId: decoded.userId, // Doit correspondre au payload JWT
        role: decoded.role 
      };
      next();
    } catch (error) {
      console.error('Erreur auth:', error.message);
      return res.status(401).json({ message: 'Authentification échouée' });
    }
  };