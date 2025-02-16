const Task = require('../models/Task');

// Ajouter une tâche
exports.createTask = async (req, res) => {
    const { title, description, client, location, startDate, endDate, technicien, vehicule, status, report } = req.body;
  
    try {
      const newTask = new Task({ title, description, client, location, startDate, endDate, technicien, vehicule, status, report });
      await newTask.save();
      res.status(201).json(newTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Récupérer toutes les tâches
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('technicien').populate('vehicule');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une tâche par ID
exports.getTaskById = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id).populate('technicien').populate('vehicule');
      if (!task) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!task) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Tâche non trouvée' });
      }
      res.status(200).json({ message: 'Tâche supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };