const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notescontroller');

// Routes pour les notes
router.post('/', notesController.createNote);
router.get('/', notesController.getAllNotes);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);
// routes/notes.js
router.get('/notifications/sse', (req, res) => {
    // Récupérer l'ID utilisateur depuis le token
    const userId = req.user._id; // À adapter selon votre système d'authentification
    
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
  
    // Stocker l'ID utilisateur avec la connexion
    const clientConnection = {
      userId,
      res
    };
  
    if (!global.gestionnaireClients) {
      global.gestionnaireClients = new Set();
    }
    // Convertir le Set en tableau pour la boucle
const clients = Array.from(global.gestionnaireClients);
clients.forEach(client => {
  if (client.userId !== userId) {
    client.res.write(`event: notification\n`);
    client.res.write(`data: ${ssePayload}\n\n`);
  }
});
    global.gestionnaireClients.add(clientConnection);
  
    req.on('close', () => {
      global.gestionnaireClients.delete(clientConnection);
    });
  });
  // routes/notes.js
router.patch('/notifications/:id/read', async (req, res) => {
    try {
      const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
      );
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  // Nouvelle route pour récupérer les notifications
router.get('/notifications', async (req, res) => {
    try {
      const { role, read } = req.query;
      const query = { role };
      
      if (read !== undefined) {
        query.read = read === 'true';
      }
      
      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .populate('relatedNote');
        
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
module.exports = router;