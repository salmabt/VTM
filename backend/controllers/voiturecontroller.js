
// controllers/voiturecontroller
const Vehicule = require('../models/Voiture'); // Assure-toi du bon chemin vers le modèle

// ➜ Créer un véhicule
exports.createVehicule = async (req, res) => {
  try {
    console.log('Données reçues :', req.body); // Vérifie les données reçues
    const vehicule = new Vehicule(req.body);
    await vehicule.save();
    console.log('Véhicule créé :', vehicule); // Log de la voiture enregistrée
    res.status(201).json(vehicule);
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement du véhicule:', err);
    res.status(400).json({ error: err.message });
  }
};

// ➜ Obtenir tous les véhicules
exports.getAllVehicules = async (req, res) => {
  try {
    //console.log('Récupération de tous les véhicules');
    const vehicules = await Vehicule.find();
    //console.log('Véhicules récupérés:', vehicules);
    res.json(vehicules);
  } catch (err) {
    console.error('Erreur lors de la récupération des véhicules:', err);
    res.status(500).json({ error: err.message });
  }
};

// ➜ Obtenir un véhicule par ID
exports.getVehiculeById = async (req, res) => {
  try {
    const vehicule = await Vehicule.findById(req.params.id);
    vehicule ? res.json(vehicule) : res.status(404).json({ error: 'Véhicule non trouvé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➜ Mettre à jour un véhicule
exports.updateVehicule = async (req, res) => {
  try {
    const vehicule = await Vehicule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    vehicule ? res.json(vehicule) : res.status(404).json({ error: 'Véhicule non trouvé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➜ Supprimer un véhicule
exports.deleteVehicule = async (req, res) => {
  try {
    const vehicule = await Vehicule.findByIdAndDelete(req.params.id);
    vehicule ? res.json({ message: 'Véhicule supprimé' }) : res.status(404).json({ error: 'Véhicule non trouvé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
