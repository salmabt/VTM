// models/Report.js
const mongoose = require('mongoose');

// models/Report.js
const reportSchema = new mongoose.Schema({
  title: String,
  description: String,
  timeSpent: Number,
  issuesEncountered: String,
  finalStatus: {
    type: String,
    enum: ['reussi', 'echouée'],
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
