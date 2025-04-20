// routes/interactions.js (backend)
const express = require("express");
const router = express.Router();
const Interaction = require("../models/Interaction");

router.post("/save-interaction", async (req, res) => {
    try {
      const { nom_client, email, service, description, phone, title_de_livraison ,address} = req.body;
  
      const newInteraction = new Interaction({ 
        nom_client,
        email,
        service,
        description,
        phone,
        title_de_livraison,
        address
      });
  
      await newInteraction.save();
      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'enregistrement: " + error.message });
    }
  });
  router.get('/', async (req, res) => {
    try {
      const interactions = await Interaction.find().sort({ createdAt: -1 });
      res.json(interactions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.patch('/:id', async (req, res) => {
    try {
      const interaction = await Interaction.findByIdAndUpdate(
        req.params.id,
        { relatedTask: req.body.relatedTask },
        { new: true }
      );
      res.json(interaction);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Ajoutez cette nouvelle route DELETE
router.delete('/:id', async (req, res) => {
  try {
    const deletedInteraction = await Interaction.findByIdAndDelete(req.params.id);
    if (!deletedInteraction) {
      return res.status(404).json({ message: 'Interaction non trouvée' });
    }
    res.json({ message: 'Interaction supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;