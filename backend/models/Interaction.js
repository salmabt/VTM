//models/Interaction.js (backend) 
const mongoose = require("mongoose");

const InteractionSchema = new mongoose.Schema({
  title_de_livraison: String,
  description: String,
  nom_client: String,
  phone: String,
  email: String, 
  service: String ,
  address: String
});

module.exports = mongoose.model("Interaction", InteractionSchema);