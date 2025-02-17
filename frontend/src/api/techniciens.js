// src/api/techniciens.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export default {
  // Récupérer tous les techniciens
  getAllTechniciens: () => api.get('/techniciens', { timeout: 3000 }),

  // Mettre à jour les compétences d'un technicien
  updateSkills: (technicienId, skills) => 
    api.patch(`/techniciens/${technicienId}/skills`, { skills }),

  // Récupérer les tâches assignées à un technicien
  getAssignedTasks: (technicienId) => 
    api.get(`/techniciens/${technicienId}/tasks`),

  // Ajouter/Supprimer disponibilité
  updateAvailability: (technicienId, availability) =>
    api.put(`/techniciens/${technicienId}/availability`, { availability })
};