// routes/interactions.js (backend)
const express = require("express");
const router = express.Router();
const Interaction = require("../models/Interaction");

router.post("/save-interaction", async (req, res) => {
    try {
      const { nom_client, email, service, description, phone, title_de_livraison } = req.body;
  
      const newInteraction = new Interaction({ 
        nom_client,
        email,
        service,
        description,
        phone,
        title_de_livraison
      });
  
      await newInteraction.save();
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'enregistrement: " + error.message });
    }
  });
  

module.exports = router;