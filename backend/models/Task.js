// backend/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  client: { type: String, required: true },
  location: {
    type: {
      address: String,
      city: String,
      coordinates: [Number],
      geocodingSuccess: Boolean,
      exactMatch: Boolean
    },
    required: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },

  adresse: {  type: mongoose.Schema.Types.Mixed, // Accepte à la fois String et Object
    required: true }, 
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  technicien: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  vehicule: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Voiture', 
    required: true 
  },
  // Ajouter cette référence
report: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Report'
},
  status: { 
    type: String, 
    enum: ['planifié', 'en cours', 'terminé'], 
    default: 'planifié' 
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: false
  }
},
{ timestamps: true } // <- Cette accolade était mal placée
);

// Ajoutez un index géospatial pour les requêtes de proximité
taskSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Task', taskSchema);