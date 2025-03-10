// models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  timeSpent: { type: Number, required: true }, // en heures
  issuesEncountered: { type: String, required: true },
  finalStatus: { type: String, required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true }, // Référence à la tâche
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
