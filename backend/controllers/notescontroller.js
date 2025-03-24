const Note = require('../models/Note'); // Assurez-vous que le chemin vers le modèle est correct
const Notification = require('../models/Notification');
// Créer une nouvelle notejjj
// controllers/notescontroller.js
exports.createNote = async (req, res) => {
  try {
    const { content, author, userId } = req.body; // Ajouter userId de l'émetteur

    const newNote = await Note.create({ 
      content, 
      author,
      timestamp: new Date()
    });

    const notification = await Notification.create({
      role: 'gestionnaire',
      message: `Nouvelle note de ${author}: ${content.substring(0, 30)}...`,
      relatedNote: newNote._id,
      senderId: userId, // Stocker l'ID de l'émetteur
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    const ssePayload = JSON.stringify({
      ...notification.toJSON(),
      senderId: userId // Inclure l'ID de l'émetteurg
    });

    // Envoyer seulement aux autres gestionnaires
    if (global.gestionnaireClients && Array.isArray(global.gestionnaireClients)) {
      global.gestionnaireClients.forEach(client => {
        if (client.userId !== userId) {
          client.write(`event: notification\n`);
          client.write(`data: ${ssePayload}\n\n`);
        }
      });
    } else {
      console.error('Gestionnaire clients non définis ou incorrectement initialisés');
    }
    

    res.status(201).json(newNote);
  } catch (error) {
    console.error('Erreur création note:', error);
    res.status(500).json({ message: error.message });
  }
};
// Récupérer toutes les notesk
// Dans votre contrôleur backend
exports.getAllNotes = async (req, res) => {
  try {
    const lastUpdate = req.query.lastUpdate || 0;
    const notes = await Note.find({
      timestamp: { $gt: new Date(lastUpdate) }
    }).sort({ timestamp: -1 });
    
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(id, { content }, { new: true });
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la note', error: error.message });
  }
};

// Supprimer une note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.status(200).json({ message: 'Note supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la note', error: error.message });
  }
};