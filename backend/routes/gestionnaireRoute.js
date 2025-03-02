//routesgestionnaires
// routes/gestionnaires.js
const express = require('express');
const router = express.Router();
const gestionnaireController = require('../controllers/gestionnaireController');

// POST /api/gestionnaires -> Créer un gestionnaire
router.post('/', gestionnaireController.createGestionnaire);

// GET /api/gestionnaires -> Récupérer tous les gestionnaires
router.get('/', gestionnaireController.getAllGestionnaires);

// PUT /api/gestionnaires/:id -> Mettre à jour un gestionnaire
router.put('/:id', gestionnaireController.updateGestionnaire);

// PUT /api/gestionnaires/:id/archive -> Archiver un gestionnaire
router.put('/:id/archive', gestionnaireController.archiveGestionnaire);
// routes/gestionnaireRoute.js
router.get('/archived', gestionnaireController.getArchivedGestionnaires); // 👈 Nouvelle route
// PUT /api/gestionnaires/:id/restore -> Restaurer un gestionnaire
router.put('/:id/restore', gestionnaireController.restoreGestionnaire);

// DELETE /api/gestionnaires/:id -> Supprimer un gestionnaire
router.delete('/:id', gestionnaireController.deleteGestionnaire);

module.exports = router;
