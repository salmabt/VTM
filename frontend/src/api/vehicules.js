import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

export default {
  getAllVehicules: () => api.get('/vehicules'),
  getVehiculeById: (id) => api.get(`/vehicules/${id}`),
  createVehicule: (data) => api.post('/vehicules', data),
  updateVehicule: (id, data) => api.put(`/vehicules/${id}`, data),
  deleteVehicule: (id) => api.delete(`/vehicules/${id}`),
};