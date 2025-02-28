const Task = require('../models/Task');
const Technicien = require('../models/users');
const Voiture = require('../models/Voiture');

exports.createTask = async (req, res) => {
  try {
    // Log de débogage pour les références
    console.log('Validation des références:', {
      technicien: req.body.technicien,
      vehicule: req.body.vehicule
    });

    // Validation approfondie des références
    const [technicien, vehicule] = await Promise.all([
      Technicien.findById(req.body.technicien),
      Voiture.findById(req.body.vehicule)
    ]);

    if (!technicien || !vehicule) {
      console.error('Références manquantes:', { 
        technicienExists: !!technicien, 
        vehiculeExists: !!vehicule 
      });
      return res.status(400).json({
        message: "Références invalides",
        details: {
          technicien: !!technicien,
          vehicule: !!vehicule
        }
      });
    }

    // Création avec double vérification
    const newTask = await Task.create(req.body);
    const populated = await Task.findById(newTask._id)
      .populate('technicien')
      .populate('vehicule');

    console.log('Tâche créée:', populated._id);
    res.status(201).json(populated);

  } catch (error) {
    console.error('Erreur critique création:', error);
    res.status(400).json({
      message: 'Échec de la création',
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('technicien', 'name role')
      .populate('vehicule');

    console.log(`Tâches chargées: ${tasks.length} éléments`);
    res.json(tasks);

  } catch (error) {
    console.error('Erreur de requête getAll:', error);
    res.status(500).json({
      message: 'Échec du chargement',
      error: error.message,
      requestId: req.requestId // Si utilisation de middleware de tracking
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('technicien')
      .populate('vehicule');

    if (!task) {
      console.warn('Tâche introuvable ID:', req.params.id);
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }

    res.json(task);

  } catch (error) {
    console.error(`Erreur recherche tâche ${req.params.id}:`, error);
    res.status(500).json({
      message: 'Échec de la récupération',
      error: error.message,
      invalidId: mongoose.Types.ObjectId.isValid(req.params.id)
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    // Vérification préalable des nouvelles références
    if (req.body.technicien) {
      const techExists = await Technicien.exists({ _id: req.body.technicien });
      if (!techExists) throw new Error('Technicien référence invalide');
    }

    if (req.body.vehicule) {
      const vehExists = await Voiture.exists({ _id: req.body.vehicule });
      if (!vehExists) throw new Error('Véhicule référence invalide');
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true,
        context: 'query' // Correction pour les validateurs Mongoose
      }
    )
    .populate('technicien')
    .populate('vehicule');

    if (!task) {
      console.warn('Tentative mise à jour ID inexistant:', req.params.id);
      return res.status(404).json({ message: 'Tâche introuvable' });
    }

    console.log('Tâche mise à jour:', task._id);
    res.json(task);

  } catch (error) {
    console.error('Erreur mise à jour:', error.message);
    res.status(400).json({
      message: 'Échec de la mise à jour',
      error: error.message,
      type: error.name // Ex: ValidationError
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      console.warn('Tentative suppression ID inexistant:', req.params.id);
      return res.status(404).json({ message: 'Tâche introuvable' });
    }

    console.log('Tâche supprimée:', task._id);
    res.json({ 
      message: 'Suppression réussie',
      deletedId: task._id 
    });

  } catch (error) {
    console.error('Erreur suppression:', error);
    res.status(500).json({
      message: 'Échec de la suppression',
      error: error.message,
      systemMessage: error.syscall // Détails système si disponible
    });
  }
};
//récupérer les tâches d'un technicien spécifique
exports.getTasksByTechnicien = async (req, res) => {
  try {
    // Recherche des tâches associées au technicien spécifique
    const tasks = await Task.find({ technicien: req.params.technicienId })
      .populate('technicien', 'name role')
      .populate('vehicule');

    if (tasks.length === 0) {
      console.warn('Aucune tâche trouvée pour le technicien:', req.params.technicienId);
      return res.status(404).json({ message: 'Aucune tâche trouvée pour ce technicien' });
    }

    res.json(tasks);

  } catch (error) {
    console.error('Erreur lors de la récupération des tâches par technicien:', error);
    res.status(500).json({
      message: 'Échec de la récupération des tâches',
      error: error.message,
    });
  }
};
