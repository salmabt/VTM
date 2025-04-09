//frontend/src/chatbotApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/chat';

export const sendMessageToChatbot = async (message) => {
  try {
    const response = await axios.post(API_URL, { message });
    return response.data;
  } catch (error) {
    console.error('Erreur API chatbot:', error);
    throw error;
  }
};
