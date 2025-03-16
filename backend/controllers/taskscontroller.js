const Task = require('../models/Task');
const Technicien = require('../models/users');
const Voiture = require('../models/Voiture');
const Report = require('../models/Report');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Créer une nouvelle tâche
exports.createTask = async (req, res) => {
  try {
    console.log('Fichiers reçus:', req.files); // Debug
    console.log('Corps de la requête:', req.body); // Debug

    // Vérifier les références (technicien et véhicule)
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

    // Gérer les pièces jointes
    const attachments = req.files?.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size
    })) || [];

    // Créer la tâche
    const taskData = {
      ...req.body,
      attachments
    };
    // Créer la tâche
    const newTask = await Task.create(taskData);
    // Mise à jour du statut du véhicule après création de la tâche
    await Voiture.findByIdAndUpdate(req.body.vehicule, { status: 'réservée' });

    // Récupérer la tâche avec les données associées
    const populated = await Task.findById(newTask._id)
      .populate('technicien')
      .populate('vehicule');

    console.log('Tâche créée:', populated._id);
    res.status(201).json(populated);

  } catch (error) {
    // Supprimer les fichiers uploadés en cas d'erreur
    if (req.files) {
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
    }
    console.error('Erreur critique création:', error);
    res.status(400).json({
      message: 'Échec de la création',
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

// Récupérer toutes les tâches
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
      requestId: req.requestId
    });
  }
};

// Récupérer une tâche par son ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('technicien')
      .populate('vehicule');

    if (!task) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }

    // Récupérer les rapports associés
    const reports = await Report.find({ taskId: task._id });
    
    // Créer un objet combiné
    const response = {
      ...task.toObject(),
      reports // Ajouter les rapports à la réponse
    };

    res.json(response); // Envoyer la réponse combinée

  } catch (error) {
    res.status(500).json({
      message: 'Échec de la récupération',
      error: error.message
    });
  }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  try {
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
        context: 'query'
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
      type: error.name
    });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche introuvable' });
    }

    // Suppression des fichiers
    task.attachments.forEach(attachment => {
      const filePath = path.join(__dirname, '../uploads', attachment.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    res.json({ message: 'Suppression réussie' });
  } catch (error) {
    console.error('Erreur suppression:', error);
    res.status(500).json({
      message: 'Échec de la suppression',
      error: error.message,
      systemMessage: error.syscall
    });
  }
};

// Récupérer les tâches d'un technicien spécifique
exports.getTasksByTechnicien = async (req, res) => {
  try {
    const technicienId = req.params.technicienId;
    console.log('Technicien ID:', technicienId);

    const tasks = await Task.find({ technicien: technicienId })
      .populate('technicien', 'name role')
      .populate('vehicule');

    console.log('Tâches trouvées:', tasks);

    if (tasks.length === 0) {
      console.warn('Aucune tâche trouvée pour le technicien:', technicienId);
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

// Mettre à jour le statut d'une tâche
// Dans exports.updateTaskStatus
exports.updateTaskStatus = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true, runValidators: true }
    ).populate('vehicule');

    if (!task) {
      return res.status(404).json({ message: 'Tâche introuvable' });
    }

    // Nouvelle logique de mise à jour du véhicule
    if (status === 'terminé' && task.vehicule) {
      const vehicleId = task.vehicule._id;
      
      // Vérifier s'il reste des tâches actives pour ce véhicule
      const activeTasks = await Task.find({
        vehicule: vehicleId,
        status: { $ne: 'terminé' },
        _id: { $ne: taskId }
      });

      if (activeTasks.length === 0) {
        await Voiture.findByIdAndUpdate(vehicleId, { status: 'disponible' });
        console.log(`Statut véhicule ${vehicleId} mis à jour à disponible`);
      }
    }

    res.json(task);

  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({
      message: 'Échec de la mise à jour',
      error: error.message
    });
  }
};


// Récupérer les pièces jointes d'une tâche spécifique
exports.getTaskAttachments = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tâche introuvable' });
    }

    if (task.attachments && task.attachments.length > 0) {
      res.json(task.attachments); // Retourne les informations sur les fichiers (nom, taille, type)
    } else {
      res.status(404).json({ message: 'Aucune pièce jointe trouvée' });
    }

  } catch (error) {
    console.error('Erreur lors de la récupération des pièces jointes:', error);
    res.status(500).json({
      message: 'Échec de la récupération des pièces jointes',
      error: error.message,
    });
  }
};

// Récupérer une pièce jointe spécifique d'une tâche
exports.getAttachmentFile = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Tâche introuvable' });
    }

    const attachment = task.attachments.find(file => file.filename === req.params.filename);

    if (!attachment) {
      return res.status(404).json({ message: 'Pièce jointe introuvable' });
    }

    const filePath = path.join(__dirname, '../uploads', attachment.filename);

    // Vérifiez si le fichier existe
    if (fs.existsSync(filePath)) {
      res.download(filePath, attachment.originalName); // Envoie le fichier à l'utilisateur
    } else {
      res.status(404).json({ message: 'Fichier introuvable' });
    }

  } catch (error) {
    console.error('Erreur lors du téléchargement de la pièce jointe:', error);
    res.status(500).json({
      message: 'Échec du téléchargement',
      error: error.message,
    });
  }
};
// Après avoir marqué une tâche comme terminée
// Remplacer les deux versions de updateTaskStatus par cette version unifiée
exports.updateTaskStatus = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { status } = req.body;

    // Mettre à jour la tâche
    const task = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true, runValidators: true }
    ).populate('technicien vehicule');

    if (!task) {
      return res.status(404).json({ message: 'Tâche introuvable' });
    }

    // Si la tâche est terminée
    if (status === 'terminé') {
      // Mettre à jour le technicien
      await Technicien.findByIdAndUpdate(
        task.technicien._id,
        { $inc: { completedTasks: 1 } }
      );

      // Mettre à jour le véhicule si besoin
      if (task.vehicule) {
        const activeTasks = await Task.find({
          vehicule: task.vehicule._id,
          status: { $ne: 'terminé' },
          _id: { $ne: taskId }
        });

        if (activeTasks.length === 0) {
          await Voiture.findByIdAndUpdate(task.vehicule._id, { status: 'disponible' });
        }

         // Calculer la durée en heures
         const durationInHours = (task.endDate - task.startDate) / (1000 * 60 * 60);

         // Mettre à jour le temps d'utilisation du véhicule
         await Voiture.findByIdAndUpdate(task.vehicule._id, {
           $inc: { utilisationHeures: durationInHours }
         });
       }
     }
    

    res.json(task);

  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    res.status(500).json({
      message: 'Échec de la mise à jour',
      error: error.message
    });
  }
};

// Récupérer le nombre total de tâches
exports.getTotalTasks = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.startDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const totalTasks = await Task.countDocuments(filter);
    res.json({ totalTasks });
  } catch (error) {
    console.error("Erreur lors du comptage des tâches:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
// Récupérer les statistiques par mois (existant)
exports.getTasksCountByMonth = async (req, res) => {
  try {
    const tasksByMonth = await Task.aggregate([
      {
        $project: {
          month: { $month: "$startDate" } // Utiliser startDate au lieu de createdAt
        }
      },
      {
        $group: {
          _id: "$month",  // Group by the month of startDate
          count: { $sum: 1 }
        }
      }
    ]);
    // Générer tous les mois avec count=0 par défaut
    const allMonths = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      count: 0
    }));
    // Fusionner avec les données existantes
    tasksByMonth.forEach(item => {
      const index = item._id - 1;
      allMonths[index].count = item.count;
    });
    res.json(allMonths);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};








