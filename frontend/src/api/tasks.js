// api/tasks
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// api/tasks.js
const tasksApi = {
  createTask: (formData) => {
    return api.post('/tasks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Spécifier le type pour les fichiers
      },
    });
  },

  // Gestion des tâches
  getAllTasks: () => api.get('/tasks'),
  getTaskById: (id) => api.get(`/tasks/${id}`),
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

  // Récupérer les pièces jointes d'une tâche
  getTaskAttachments: (taskId) => api.get(`/tasks/${taskId}/attachments`),

  // Télécharger une pièce jointe spécifique d'une tâche
  downloadAttachment: (taskId, filename) => {
    // Envoie une requête pour télécharger le fichier
    return api.get(`/tasks/${taskId}/attachments/${filename}`, {
      responseType: 'blob', // Important pour télécharger des fichiers binaires
    });
  },
  // Récupérer les notifications
getNotifications: (userId) => api.get(`/tasks/notifications?userId=${userId}`),

// Marquer comme lue
markNotificationRead: (id) => api.patch(`/tasks/notifications/${id}/read`),
};

// Intercepteur pour gérer les erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Rediriger vers la page de connexion si le token est invalide
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      // Vous pouvez ajouter d'autres types d'erreurs ici
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);


export default tasksApi; // Export par défaut de tasksApi
