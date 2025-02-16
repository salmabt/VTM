const Vehicule = require('../models/Voiture'); // Assure-toi du bon chemin vers le modèle

// ➜ Créer un véhicule
exports.createVehicule = async (req, res) => {
  try {
    const vehicule = new Vehicule(req.body);
    await vehicule.save();
    res.status(201).json(vehicule);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ➜ Obtenir tous les véhicules
exports.getAllVehicules = async (req, res) => {
  try {
    const vehicules = await Vehicule.find();
    res.json(vehicules);
  } catch (err) {
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
