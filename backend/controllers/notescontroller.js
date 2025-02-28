const Note = require('../models/Note'); // Assurez-vous que le chemin vers le modèle est correct

// Créer une nouvelle note
exports.createNote = async (req, res) => {
  try {
    const { content, author, timestamp } = req.body;
    const newNote = new Note({ content, author, timestamp });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la note', error: error.message });
  }
};

// Récupérer toutes les notes
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find().sort({ timestamp: -1 }); // Trie les notes par date décroissante
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des notes', error: error.message });
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