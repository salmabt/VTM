//api/vehicules
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// Intercepteur pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Rediriger vers la page de connexion si le token est invalide
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  // Gestion des tâches
  getAllTasks: () => api.get('/tasks'),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),

  // Gestion des techniciens
  getTechniciens: () => api.get('/techniciens'),

  // Filtrage des tâches
  getTasksByTechnicien: (technicienId) => api.get(`/tasks/technicien/${technicienId}`),
  getTasksByVehicule: (vehiculeId) => api.get(`/tasks?vehicule=${vehiculeId}`),
  getTasksByStatus: (status) => api.get(`/tasks?status=${status}`),

  // Gestion des véhicules
  getVehicules: () => api.get('/vehicules'),

  // Gestion des rapports de tâches
  getTaskReport: (taskId) => api.get(`/tasks/${taskId}/report`),
  updateTaskStatus: (taskId, statusData) => api.patch(`/tasks/${taskId}/status`, statusData),
  addTaskReport: (taskId, reportData) => api.post(`/tasks/${taskId}/report`, reportData),
};
