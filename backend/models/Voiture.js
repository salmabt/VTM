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
    type: Number
    ,required: false
  },
  lastMaintenance: Date

});

module.exports = mongoose.model('Voiture', voitureSchema); // Le nom du modèle est "Voiture"