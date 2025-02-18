const express = require('express');
const router = express.Router();
const Technicien = require('../models/users');
const { createTechnicien } = require('../controllers/technicienController');

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

module.exports = router;