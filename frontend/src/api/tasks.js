//frontend/src/api/tasks
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export default {
  getAllTasks: () => api.get('/tasks'),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getTechniciens: () => api.get('/techniciens'), // Correction de la virgule manquante

  // Endpoints complémentaires
  getTasksByTechnicien: (technicienId) => 
    api.get(`/tasks?technicien=${technicienId}`), // Correction syntaxique
  
  getTasksByVehicule: (vehiculeId) => 
    api.get(`/tasks?vehicule=${vehiculeId}`),
  
  getTasksByStatus: (status) => 
    api.get(`/tasks?status=${status}`),
  
  getVehicules: () => api.get('/vehicules'),
  
  getTaskReport: (taskId) => 
    api.get(`/tasks/${taskId}/report`),
  
  updateTaskStatus: (taskId, status) => 
    api.patch(`/tasks/${taskId}/status`, { status }),
  
  addTaskReport: (taskId, reportData) => 
    api.post(`/tasks/${taskId}/report`, reportData)
};