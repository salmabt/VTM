// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const exceljs = require('exceljs');
const pdfmake = require('pdfmake');

const reportController = require('../controllers/reportTechController');

// Ajouter un rapport
router.post('/add', reportController.addReport);

// Récupérer les rapports pour une tâche donnée
router.get('/task/:taskId', reportController.getReports);
router.get('/technicien/:technicienId', reportController.getReportsByTechnicien);
router.get('/techniciens/stats', async (req, res) => {
    try {
      const stats = await Technicien.aggregate([
        {
          $lookup: {
            from: 'tasks',
            localField: '_id',
            foreignField: 'technicien',
            as: 'tasks'
          }
        },
        {
          $project: {
            name: 1,
            completedTasks: {
              $size: {
                $filter: {
                  input: '$tasks',
                  as: 'task',
                  cond: { $eq: ['$$task.status', 'terminé'] }
                }
              }
            },
            averageRating: { $avg: '$tasks.rating' }
          }
        }
      ]);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.get('/export/excel', async (req, res) => {
    try {
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Rapport');
      
      // Entêtes
      worksheet.columns = [
        { header: 'Technicien', key: 'name' },
        { header: 'Missions terminées', key: 'completedTasks' },
        { header: 'Note moyenne', key: 'averageRating' }
      ];
  
      // Données
      const stats = await getTechnicianStats();
      worksheet.addRows(stats);
  
      // Envoi
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=rapport.xlsx');
      await workbook.xlsx.write(res);
      res.end();
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  // Stats détaillées des techniciens
router.get('/techniciens/stats-detailed', async (req, res) => {
    try {
      const stats = await Technicien.aggregate([
        {
          $lookup: {
            from: 'tasks',
            localField: '_id',
            foreignField: 'technicien',
            as: 'tasks'
          }
        },
        {
          $addFields: {
            completedTasks: {
              $size: {
                $filter: {
                  input: '$tasks',
                  as: 'task',
                  cond: { $eq: ['$$task.status', 'terminé'] }
                }
              }
            },
            totalRating: {
              $sum: '$tasks.rating'
            },
            averageRating: {
              $cond: [
                { $gt: [{ $size: '$tasks' }, 0] },
                { $divide: ['$totalRating', { $size: '$tasks' }] },
                0
              ]
            }
          }
        },
        {
          $project: {
            name: 1,
            completedTasks: 1,
            averageRating: { $round: ['$averageRating', 1] },
            skills: 1,
            phone: 1
          }
        }
      ]);
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Stats d'utilisation des véhicules
  router.get('/vehicules/stats', async (req, res) => {
    try {
      const stats = await Voiture.aggregate([
        {
          $lookup: {
            from: 'tasks',
            localField: '_id',
            foreignField: 'vehicule',
            as: 'tasks'
          }
        },
        {
          $addFields: {
            utilisationHeures: {
              $sum: {
                $map: {
                  input: '$tasks',
                  as: 'task',
                  in: {
                    $divide: [
                      { $subtract: ['$$task.endDate', '$$task.startDate'] },
                      3600000 // Conversion millisecondes -> heures
                    ]
                  }
                }
              }
            },
            lastMaintenance: {
              $max: '$tasks.endDate'
            }
          }
        },
        {
          $project: {
            model: 1,
            registration: 1,
            status: 1,
            utilisationHeures: { $round: ['$utilisationHeures', 1] },
            lastMaintenance: 1
          }
        }
      ]);
  
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


module.exports = router;
