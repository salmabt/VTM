//models/Interaction.js (backend) 
const mongoose = require("mongoose");

const InteractionSchema = new mongoose.Schema({
  nom_client: String, 
  email: String, 
  phone: String,
  address: String,
  service: String ,
  title_de_livraison: String,
  description: String,
<<<<<<< HEAD
  nom_client: String,
  phone: String,
  email: String, 
  address: String,
=======
>>>>>>> f049af40b3d9963fd90b4b76dadaca9f8048b3a2
  relatedTask: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }
});

module.exports = mongoose.model("Interaction", InteractionSchema);