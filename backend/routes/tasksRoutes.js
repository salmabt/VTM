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
  updateTaskStatus,
  getTaskAttachments,
  getAttachmentFile,
  getTotalTasks,
  getTasksCountByMonth,
  // Ajouter les nouvelles fonctions de notification
  getNotifications,
  markNotificationRead
} = require('../controllers/taskscontroller');

// Routes pour les notifications (doivent être placées en premier)
router.get('/notifications/sse', (req, res) => {
  const userId = req.query.userId?.toString();
  console.log(`Connexion SSE pour user: ${userId}`);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Envoyer un commentaire de maintien de connexion
  const keepAlive = setInterval(() => res.write(':keep-alive\n\n'), 30000);

  // Stocker la connexion
  if (!global.clients) global.clients = new Map();
  if (userId) global.clients.set(userId, res);

  req.on('close', () => {
    console.log(`Déconnexion SSE user: ${userId}`);
    clearInterval(keepAlive);
    if (userId) global.clients.delete(userId);
  });
});

router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

// Routes pour les tâches
router.post('/', 
  upload.array('attachments', 5),
  (req, res, next) => {
    console.log('Fichiers reçus:', req.files);
    next();
  },
  createTask
);

router.get('/count-by-month', getTasksCountByMonth);
router.get('/', getAllTasks);
router.get('/count', getTotalTasks);

// Routes paramétrées (doivent être placées après les routes fixes)
router.get('/technicien/:technicienId', getTasksByTechnicien);
router.get('/:id', getTaskById);
router.put('/:id', upload.array('attachments'), updateTask);
router.delete('/:id', deleteTask);
router.patch('/:taskId/status', updateTaskStatus);
router.get('/:id/attachments', getTaskAttachments);
router.get('/:id/attachments/:filename', getAttachmentFile);

module.exports = router;