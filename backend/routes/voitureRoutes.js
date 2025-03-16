// routes/voitureRoutes.js
const express = require('express');
const router = express.Router();
const voitureController = require('../controllers/voiturecontroller'); // Assure-toi que le chemin est correct

// ➜ Ajouter une voiture
router.post('/', voitureController.createVehicule);

// ➜ Récupérer toutes les voitures
router.get('/', voitureController.getAllVehicules); // Utilise 'getAllVehicules' comme dans le contrôleur

// ➜ Récupérer une voiture par ID
router.get('/:id', voitureController.getVehiculeById); // Utilise 'getVehiculeById' comme dans le contrôleur

// ➜ Mettre à jour une voiture
router.put('/:id', voitureController.updateVehicule); // Utilise 'updateVehicule' comme dans le contrôleur

// ➜ Supprimer une voiture
router.delete('/:id', voitureController.deleteVehicule); // Utilise 'deleteVehicule' comme dans le contrôleur

// ➜ Récupérer les véhicules par technicien
router.get('/technicien/:technicienId', voitureController.getVehiculesByTechnicien);

router.get('/:id/utilisation', voitureController.getVehiculeUtilisation);
module.exports = router;
