// controllers/reportTechController.js
const Report = require('../models/Report');
const Task = require('../models/Task');

// Ajouter un rapport
exports.addReport = async (req, res) => {
  try {
    const { title, description, timeSpent, issuesEncountered, finalStatus, taskId } = req.body;

    // Vérification de l'existence de la tâche
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(400).json({ message: 'Tâche non trouvée' });
    }

    const newReport = new Report({
      title,
      description,
      timeSpent,
      issuesEncountered,
      finalStatus,
      taskId,
    });

    await newReport.save();
    return res.status(201).json({ message: 'Rapport ajouté avec succès', report: newReport });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de l\'ajout du rapport' });
  }
};

// Obtenir tous les rapports pour un technicien (ou une tâche spécifique)
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({ taskId: req.params.taskId });
    return res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des rapports' });
  }
};
// Nouvelle méthode pour obtenir les rapports par technicien
exports.getReportsByTechnicien = async (req, res) => {
    try {
      // 1. Trouver toutes les tâches du technicien
      const tasks = await Task.find({ technicien: req.params.technicienId });
      
      // 2. Extraire les IDs des tâches
      const taskIds = tasks.map(task => task._id);
      
      // 3. Trouver tous les rapports liés à ces tâches
      const reports = await Report.find({ taskId: { $in: taskIds } })
        .populate('taskId', 'title status'); // Peupler les données de la tâche
      
      return res.status(200).json(reports);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des rapports' });
    }
  };
