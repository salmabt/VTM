const Note = require('../models/Note'); // Assurez-vous que le chemin vers le modèle est correct

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