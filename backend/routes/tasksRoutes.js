const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/taskscontroller');

// Ajouter une tâche
router.post('/', tasksController.createTask);

// Récupérer toutes les tâches
router.get('/', tasksController.getAllTasks);

// Récupérer une tâche par ID
router.get('/:id', tasksController.getTaskById);
// Mettre à jour une tâche
router.put('/:id', tasksController.updateTask);

// Supprimer une tâche
router.delete('/:id', tasksController.deleteTask);

module.exports = router;