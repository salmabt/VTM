//frontend/src/api/technicien
import axios from 'axios';
// Création d'une instance d'axios avec la baseURL et les headers
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Assure-toi que cette URL est correcte
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`, // Utilisation du token JWT pour l'authentification
  },
});
// Export des différentes fonctions pour appeler l'API
export default {
  // Récupérer tous les techniciens
  getAllTechniciens: () => api.get('/techniciens', { timeout: 3000 }),
  // Mettre à jour les compétences d'un technicien
  updateSkills: (technicienId, skills) =>
    api.patch(`/techniciens/${technicienId}/skills`, { skills }),
  // Récupérer les tâches assignées à un technicien
  getAssignedTasks: (technicienId) =>
    api.get(`/techniciens/${technicienId}/tasks`),
  // Mettre à jour la disponibilité d'un technicien
  updateAvailability: (technicienId, availability) =>
    api.put(`/techniciens/${technicienId}/availability`, { availability }),
  // Mettre à jour un technicien (par exemple, ses informations personnelles)
  updateTechnicien: (technicienId, technicienData) =>
    api.put(`/techniciens/${technicienId}`, technicienData),
  // Archiver un technicien en mettant à jour son statut
  archiveTechnicien: (technicienId) => 
    api.put(`/techniciens/${technicienId}/archive`).then(res => res.data), // Appel à l'API pour archiver un technicien
  getArchivedTechniciens: () => api.get('/techniciens/archived'),
  restoreTechnicien: (technicienId) => 
    api.put(`/techniciens/${technicienId}/restore`),
};