const express = require('express');
const authController = require('../controllers/authcontroller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/validate/:userId', authController.validateUser);// Route pour valider l'utilisateur 
router.post('/validate/:userId', authController.validateUser);



module.exports = router;