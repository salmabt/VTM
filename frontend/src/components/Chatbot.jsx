// frontend/components/Chatbot.jsx
import React, { useState, useEffect } from 'react';
import { saveInteraction } from '../api/services'; 
import { sendMessageToChatbot } from '../api/chatbotApi';
import '../styles/Chatbot.css';

const Chatbot = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({
    nom_client: '',
    email: '',
    service: '',
    phone: '',
    title_de_livraison: '',
    description: ''
  });

  // Déclencher la sauvegarde quand tous les champs sont remplis
  useEffect(() => {
    if (Object.values(formData).every(field => field !== '')) {
      saveInteraction(formData)
        .then(() => console.log('Données sauvegardées !'))
        .catch(err => console.error('Erreur:', err));
    }
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      // 1. Envoyer le message au chatbot
      const chatbotResponse = await sendMessageToChatbot(input);

      if (!chatbotResponse?.entities) {
        throw new Error("Format de réponse du chatbot invalide");
      }
      
      // 2. Extraire les entités de la réponse
      const extractedData = {
        nom_client: chatbotResponse.entities.nom_client|| '',
        email: chatbotResponse.entities.email || '',
        service: chatbotResponse.entities.service || '',
        phone: chatbotResponse.entities.phone || '',
        title_de_livraison: chatbotResponse.entities.title_de_livraison || '',
        description: chatbotResponse.entities.description || ''
      };
     
      // 3. Mettre à jour les données du formulaire
      setFormData(prev => ({ ...prev, ...extractedData }));

      // 4. Mettre à jour l'interface
      setMessages(prev => [
        ...prev,
        { text: input, isBot: false },
        { text: chatbotResponse.reply, isBot: true }
      ]);

      setInput('');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="chatbot-container">
        {/* En-tête avec bouton de fermeture */}
      <div className="chat-header">
        <h3>Digital Market Bot</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écrivez votre message..."
        />
        <button type="submit">Envoyer</button>
      </form>
    </div> 
  );
};

export default Chatbot;