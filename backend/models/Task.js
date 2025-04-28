///// backend/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  client: { type: String, required: true },
  location: {
    type: String, // Accepte à la fois String et Object
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
      required: true,
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] !== 0 && v[1] !== 0 && // Rejette [0,0]
                 v[0] >= -180 && v[0] <= 180 && // Longitude valide
                 v[1] >= -90 && v[1] <= 90;    // Latitude valide
        },
        message: props => `${props.value} n'est pas une position géographique valide!`
      }
    }
  },

  adresse: { type: String, required: true }, 
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