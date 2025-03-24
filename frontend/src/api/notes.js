//api/note.js
import axios from 'axios'; // Assurez-vous d'avoir installé axios (npm install axios)

const API_URL = 'http://localhost:3000/api/notes'; // Remplacez par l'URL de votre backend

// Créer une nouvelle note
const createNote = async (noteData) => {
  const response = await axios.post('/api/notes', noteData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

// Récupérer toutes les notes
const getAllNotes = async () => {
  try {
    const response = await axios.get(API_URL); // Utilisez API_URL au lieu de '/api/notes'
    console.log('Réponse complète de l\'API:', response);
    return response.data; // Renvoie les données si elles existent
  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error);
    throw error;
  }
};

// Mettre à jour une note
const updateNote = async (id, noteData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, noteData);
    return response.data; // Retourne la note mise à jour
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la note:', error);
    throw error;
  }
};

// Supprimer une note
const deleteNote = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data; // Retourne la réponse du serveur
  } catch (error) {
    console.error('Erreur lors de la suppression de la note:', error);
    throw error;
  }
};

export default {
  createNote,
  getAllNotes,
  updateNote,
  deleteNote,
};