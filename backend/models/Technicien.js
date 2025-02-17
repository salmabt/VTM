const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Un utilisateur est requis'],
    unique: true
  },
  phone: {
    type: String,
    validate: {
      validator: v => /^0[67]\d{8}$/.test(v),
      message: 'Format de téléphone invalide (ex: 06 12 34 56 78)'
    }
  },
  skills: [String],
  availability: [{
    day: {
      type: [String], // Modifié pour accepter un tableau de chaînes
      enum: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'] // Liste des jours autorisés
    },
    timeSlots: [{
      start: String,
      end: String
    }]
  }]
}, { timestamps: true });

module.exports = mongoose.model('Technicien', technicianSchema);
