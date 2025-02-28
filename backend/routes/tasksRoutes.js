// backend/routes/tasksRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByTechnicien // Ajout de la méthode
  
} = require('../controllers/taskscontroller');

router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

router.get('/technicien/:technicienId', getTasksByTechnicien);

module.exports = router;