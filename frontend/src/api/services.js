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