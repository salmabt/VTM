//api/vehicules
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export default {
  getAllVehicules: () => api.get('/vehicules')
    .then(res => {
      if (!Array.isArray(res.data)) throw new Error('Format de données invalide');
      return res;
    }),
  getVehiculeById: (id) => api.get(`/vehicules/${id}`),
  createVehicule: (data) => api.post('/vehicules', data),
  updateVehicule: (id, data) => api.put(`/vehicules/${id}`, data),
  // Modification ici - envoie directement l'objet avec le statut
  updateVehiculeStatus: (id, status) => api.patch(`/vehicules/${id}/status`, { status }),
  deleteVehicule: (id) => api.delete(`/vehicules/${id}`),
  getVehiculesByTechnicien: (technicienId) => 
    api.get(`/vehicules/technicien/${technicienId}`)
      .then(res => {
        if (!Array.isArray(res.data)) throw new Error('Format de données invalide');
        return res;
      }),
};