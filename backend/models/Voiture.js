//models/Voiture
const mongoose = require('mongoose');

const voitureSchema = new mongoose.Schema({
  registration: { type: String, required: true },
  model: { type: String, required: true },
  status: { type: String, required: true },  // Exemple : 'disponible', 'en entretien', etc.
});

module.exports = mongoose.model('Voiture', voitureSchema); // Le nom du modèle est "Voiture"