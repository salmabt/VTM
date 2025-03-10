// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportTechController');

// Ajouter un rapport
router.post('/add', reportController.addReport);

// Récupérer les rapports pour une tâche donnée
router.get('/task/:taskId', reportController.getReports);
router.get('/technicien/:technicienId', reportController.getReportsByTechnicien);

module.exports = router;
