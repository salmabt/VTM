//models/notification
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return !this.role; // Requis seulement si role n'est pas défini
    }
  },
  role: {
    type: String,
    enum: ['technicien', 'gestionnaire'],
    required: false
    },

  message: {
    type: String,
    required: true
  },
  relatedTask: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  relatedNote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    index: { expires: '0s' } // Auto-suppression après expiration
  }
});

module.exports = mongoose.model('Notification', notificationSchema);