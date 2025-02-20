const express = require('express');
const router = express.Router();
const Technicien = require('../models/users');
const { createTechnicien } = require('../controllers/technicienController');
const { archiveTechnicien } = require('../controllers/technicienController');
// Créer un technicien
router.post('/', createTechnicien);

// Récupérer tous les techniciens
router.get('/', async (req, res) => {
  try {
    const techniciens = await Technicien.find({ role: 'technicien' })
      .select('name email phone skills availability')
      .lean();

    res.json(techniciens);
  } catch (error) {
    console.error('Erreur techniciens:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des techniciens' });
  }
});

// Mettre à jour un technicien
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTechnicien = await Technicien.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedTechnicien) {
      return res.status(404).json({ message: "Technicien non trouvé" });
    }

    res.json(updatedTechnicien);
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.put('/:id/archive', archiveTechnicien);

module.exports = router;