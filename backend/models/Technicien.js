const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  skills: [{ type: String }],
  availability: [{
    day: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true }
  }],
  assignedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

module.exports = mongoose.model('Technicien', technicianSchema);