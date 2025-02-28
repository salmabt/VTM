// src/api/gestionnaires.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // pas de slash final
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`, // si vous gérez le token
  },
});

export default {
  createGestionnaire: (gestionnaireData) => api.post('/gestionnaires', gestionnaireData),
  getAllGestionnaires: async () => {
    const response = await api.get('/gestionnaires');
    console.log("Données reçues de l'API :", response.data);
    return response;
  },
};
