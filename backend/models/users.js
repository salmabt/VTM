const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'gestionnaire', 'technicien'], default: 'technicien' },
  phone: { type: String ,required: false},
  isApproved: { type: Boolean, default: false },
  skills: { type: Array, default: [] },
  archived: { type: Boolean, default: false },
  completedTasks: { 
    type: Number, 
    required: false
  },
  averageRating: { 
    type: Number,
    required: false 
   
  },
}, { timestamps: true });

// Middleware pour hacher le mot de passe avant de sauvegarder
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.password.startsWith('$2a$')) { // ✅ Évite de hacher un mot de passe déjà chiffré
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


module.exports = mongoose.model('User', userSchema);