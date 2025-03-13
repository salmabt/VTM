const express = require('express');
const router = express.Router();
const Technicien = require('../models/users');
const {createTechnicien, archiveTechnicien,restoreTechnicien,getArchivedTechniciens,updateTechnicien,loginTechnicien } = require('../controllers/technicienController');

router.post('/', createTechnicien);
router.post('/login', loginTechnicien);

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
router.put('/:id/restore', restoreTechnicien);
router.get('/archived', getArchivedTechniciens);


router.get('/count', async (req, res) => {
  try {
    const countTechniciens = await Technicien.countDocuments({ role: 'technicien' });
    res.json({ totalTechniciens: countTechniciens });
  } catch (error) {
    console.error("Erreur lors du comptage des techniciens:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;