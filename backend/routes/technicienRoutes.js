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
        select: 'name email'
      })
      .populate('assignedTasks');

    res.json(techniciens);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur de chargement',
      error: error.message 
    });
  }
});

module.exports = router;