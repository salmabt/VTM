const express = require('express');
const router = express.Router();
const Technicien = require('../models/users');
const Task = require('../models/Task');
const {createTechnicien, archiveTechnicien,restoreTechnicien,getArchivedTechniciens,updateTechnicien,loginTechnicien,getTechniciensWithStats ,getAllTechniciens } = require('../controllers/technicienController');

router.post('/', createTechnicien);
router.post('/login', loginTechnicien);

router.get('/', getAllTechniciens); // Utilisation de la fonction importée
router.get('/archived', getArchivedTechniciens);


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



// GET /api/techniciens/count
router.get('/count', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { role: 'technicien' };

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const countTechniciens = await Technicien.countDocuments(filter);
    res.json({ totalTechniciens: countTechniciens });
  } catch (error) {
    console.error("Erreur lors du comptage:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// controllers/technicienController.js
router.get('/bestTechnician', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const matchStage = {};

    if (startDate && endDate) {
      matchStage.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const technicienWithMostTasks = await Task.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$technicien',
          taskCount: { $sum: 1 }
        }
      },
      { $sort: { taskCount: -1 } },
      { $limit: 1 }
    ]);

    if (technicienWithMostTasks.length === 0) {
      return res.json({ name: 'Aucun' });
    }

    const technicienId = technicienWithMostTasks[0]._id;
    const bestTechnician = await Technicien.findById(technicienId).select('name');
    
    res.json({ name: bestTechnician?.name || 'Aucun' });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour noter un technicien
// Ajouter une validation et initialisation des valeurs
router.post('/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    // Validation basique
    if (isNaN(rating) || rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Note invalide' });
    }

    // Trouver le technicien
    const technicien = await Technicien.findById(id);
    if (!technicien) return res.status(404).json({ message: 'Technicien non trouvé' });

    // Calcul simplifié
    const newRatingCount = technicien.ratingCount + 1;
    const newAverageRating = 
      ((technicien.averageRating * technicien.ratingCount) + parseFloat(rating)) / newRatingCount;

    // Mise à jour directe
    const updated = await Technicien.findByIdAndUpdate(
      id,
      { 
        averageRating: Number(newAverageRating.toFixed(1)), // 1 décimal
        ratingCount: newRatingCount 
      },
      { new: true, select: 'name averageRating ratingCount completedTasks skills' } 
    );

    res.json(updated);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/with-stats', getTechniciensWithStats); 

module.exports = router;