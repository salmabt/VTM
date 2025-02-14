const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['technicien'] },
  isApproved: { type: Boolean, default: true }, // Par défaut, l'utilisateur est approuvé
  createdAt: { type: Date, default: Date.now }, // Correction : utiliser Date et définir la valeur par défaut
});

module.exports = mongoose.model('User', UserSchema);
