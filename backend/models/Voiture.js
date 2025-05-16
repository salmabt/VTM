//models/Voiture
const mongoose = require('mongoose');

const voitureSchema = new mongoose.Schema({
  registration: { type: String, required: true },
  model: { type: String, required: true },
  status: {
    type: String,
    enum: ['disponible', 'réservé', 'en entretien'],
    default: 'disponible'
  } ,
  utilisationHeures: { 
    type: Number,
    required: false,
    default: 0
  },
  lastMaintenance: {
    type: Date
  },
  image: {
    type: String, // Base64 ou URL
    required: false
  },
  region: {
    type: String,
    enum: ['nord', 'milieu', 'sahel', 'sud'],
    required: true
  }

});

module.exports = mongoose.model('Voiture', voitureSchema); // Le nom du modèle est "Voiture"