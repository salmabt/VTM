const express = require('express');
const router = express.Router();
const Technicien = require('../models/Technicien');
const { createTechnicien } = require('../controllers/technicienController');

router.post('/', createTechnicien);

router.get('/', async (req, res) => {
  try {
    const techniciens = await Technicien.find()
      .populate({
        path: 'user',
        select: 'name email -_id' // Exclure l'ID utilisateur
      })
      .lean(); // Convertir en objet JSON

    res.json(techniciens.map(t => ({
      ...t,
      userName: t.user?.name || 'Non assigné'
    })));
    
  } catch (error) {
    console.error('Erreur techniciens:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;