const express = require('express');
const router = express.Router();
const vehiculeController = require('../controllers/voiturecontroller');

// ➜ Ajouter un véhicule
router.post('/', vehiculeController.createVehicule);

// ➜ Récupérer tous les véhicules
router.get('/', vehiculeController.getAllVehicules);

// ➜ Récupérer un véhicule par ID
router.get('/:id', vehiculeController.getVehiculeById);

// ➜ Mettre à jour un véhicule
router.put('/:id', vehiculeController.updateVehicule);

// ➜ Supprimer un véhicule
router.delete('/:id', vehiculeController.deleteVehicule);

module.exports = router;
