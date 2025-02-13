const mongoose = require('mongoose');

// Si le modèle existe déjà, on le récupère, sinon on le définit
const PendingUser = mongoose.models.PendingUser || mongoose.model('PendingUser', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['gestionnaire', 'technicien'] },
  isApproved: { type: Boolean, default: false },
}));

module.exports = PendingUser;
