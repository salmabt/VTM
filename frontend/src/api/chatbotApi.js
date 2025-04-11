//frontend/src/chatbotApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/chat';

export const sendMessageToChatbot = async (message, sessionId = 'default-session') => {
  try {
    const response = await axios.post(API_URL, { 
      message,
      sessionId // Maintenir la même session
    });
    
    // Normalisation de la réponse
    return {
      reply: response.data.reply || "Désolé, je n'ai pas compris",
      entities: response.data.entities || {}
    };
  } catch (error) {
    console.error('Erreur API chatbot:', error);
    return {
      reply: "Service temporairement indisponible",
      entities: {}
    };
  }
};
