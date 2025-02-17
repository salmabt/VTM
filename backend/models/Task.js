// backend/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  client: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  technicien: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Technicien', 
    required: true 
  },
  vehicule: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Voiture', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['planifié', 'en cours', 'terminé'], 
    default: 'planifié' 
  },
  report: {
    timeSpent: Number,
    issues: String,
    resolution: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);