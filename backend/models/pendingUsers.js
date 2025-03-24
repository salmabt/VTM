const mongoose = require('mongoose');

// Si le modèle existe déjà, on le récupère, sinon on le définit
const PendingUser = mongoose.models.PendingUser || mongoose.model('PendingUser', new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['technicien'],
    default: 'technicien'
  },
  isApproved: { 
    type: Boolean, 
    default: false 
  },
  phone: {
    type: String,
    required: true, // Champ requis
    validate: {
      validator: v => /^\d{8}$/.test(v),
      message: 'Format de téléphone invalide (ex: 12345678)'
    }
  },
  skills: { 
    type: [String], // Tableau de chaînes pour stocker plusieurs compétences
    required: false // Défini ici
  },
  location: { 
    type: String,
   required: true
   }, // Ajout de la localisation
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}));

module.exports = PendingUser;
