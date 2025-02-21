const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
  /*status: {
    type: String,
    enum: ['actif', 'inactif'],
    default: 'actif',
  },*/
  archived: {
    type: Boolean,
    default: false, // Par défaut, le technicien n'est pas archivé
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', UserSchema);