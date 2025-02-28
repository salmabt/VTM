const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'gestionnaire', 'technicien'], default: 'technicien' },
  phone: { type: String },
  isApproved: { type: Boolean, default: false },
  skills: { type: Array, default: [] },
  archived: { type: Boolean, default: false },
}, { timestamps: true });

// Middleware pour hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Ne pas hacher si le mot de passe n'est pas modifié

  try {
    const salt = await bcrypt.genSalt(12); // Générer un salt
    this.password = await bcrypt.hash(this.password, salt); // Hacher le mot de passe
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);