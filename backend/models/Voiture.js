const mongoose = require('mongoose');

const vehiculeSchema = new mongoose.Schema({
  registration: String,
  model: String,
  status: String, //disponible, en entretien, réservé
});

module.exports = mongoose.model('Vehicule', vehiculeSchema);