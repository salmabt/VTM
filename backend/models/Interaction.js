//models/Interaction.js (backend) 
const mongoose = require("mongoose");

const InteractionSchema = new mongoose.Schema({
  nom_client: String, 
  email: String, 
  phone: String,
  address: String,
  title_de_livraison: String,
  description: String,
  relatedTask: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }
});

module.exports = mongoose.model("Interaction", InteractionSchema);