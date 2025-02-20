import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

export default {
  getAllTechniciens: () => api.get('/techniciens', { timeout: 3000 }),
  updateSkills: (technicienId, skills) => 
    api.patch(`/techniciens/${technicienId}/skills`, { skills }),
  getAssignedTasks: (technicienId) => 
    api.get(`/techniciens/${technicienId}/tasks`),
  updateAvailability: (technicienId, availability) =>
    api.put(`/techniciens/${technicienId}/availability`, { availability }),

  // ✅ Ajout de la mise à jour d'un technicien
  updateTechnicien: (technicienId, technicienData) => 
    api.put(`/techniciens/${technicienId}`, technicienData),

  archiveTechnicien: (technicienId) => 
    api.put(`/techniciens/${technicienId}/archive`),

};
