const express = require('express');
const { upload } = require('../config/multer');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByTechnicien,
  updateTaskStatus ,
  getTaskAttachments,
  getAttachmentFile// Utilisez la fonction directement
} = require('../controllers/taskscontroller'); // Assurez-vous que le chemin est correct

// Routes pour les tâches
router.post('/', 
  upload.array('attachments', 5), // Accepter jusqu'à 5 fichiers
  (req, res, next) => {
    console.log('Fichiers reçus:', req.files);
    next();
  },
  createTask
);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.put('/:id', upload.array('attachments'), updateTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);


// Route pour récupérer les tâches d'un technicien spécifique
router.get('/technicien/:technicienId', getTasksByTechnicien);

// Route pour mettre à jour le statut d'une tâche
router.patch('/:taskId/status', updateTaskStatus); // Utilisez la fonction directement
// Récupérer les pièces jointes d'une tâche spécifique
router.get('/:id/attachments', getTaskAttachments);

// Télécharger une pièce jointe spécifique d'une tâche
router.get('/:id/attachments/:filename', getAttachmentFile);




module.exports = router;