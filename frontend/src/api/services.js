//frontend/src/api/services
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const saveInteraction = async (data) => {
  try {
    const response = await API.post('/interactions/save-interaction', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Ajoutez cette nouvelle fonction
export const deleteInteraction = async (id) => {
  try {
    const response = await API.delete(`/interactions/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};