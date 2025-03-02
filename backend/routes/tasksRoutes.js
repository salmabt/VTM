const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByTechnicien,
  updateTaskStatus // Utilisez la fonction directement
} = require('../controllers/taskscontroller'); // Assurez-vous que le chemin est correct

// Routes pour les tâches
router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Route pour récupérer les tâches d'un technicien spécifique
router.get('/technicien/:technicienId', getTasksByTechnicien);

// Route pour mettre à jour le statut d'une tâche
router.patch('/:taskId/status', updateTaskStatus); // Utilisez la fonction directement

module.exports = router;