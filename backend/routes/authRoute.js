const express = require('express');
const authController = require('../controllers/authcontroller');
const isAdmin = require('../middleware/isAdmin'); // Importez le middleware
const authMiddleware = require('../middleware/authMiddleware'); // Middleware d'authentification

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Route de validation (protégée par authMiddleware et isAdmin)
router.post('/validate/:userId', authMiddleware, isAdmin, authController.validateUser);

module.exports = router;