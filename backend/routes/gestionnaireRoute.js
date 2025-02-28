const express = require('express');
const router = express.Router();
const gestionnaireController = require('../controllers/gestionnaireController');

// POST /api/gestionnaires -> Créer un gestionnaire
router.post('/', gestionnaireController.createGestionnaire);
// GET /api/gestionnaires -> Récupérer tous les gestionnaires
router.get('/', gestionnaireController.getAllGestionnaires);


module.exports = router;
