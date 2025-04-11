// frontend/components/Chatbot.jsx
import React, { useState, useEffect,useRef } from 'react';
import { saveInteraction } from '../api/services'; 
import { sendMessageToChatbot } from '../api/chatbotApi';
import '../styles/Chatbot.css';
import botIcon from '../assets/bot-icon.png'; 
import userIcon from '../assets/user-icon.png'; 

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
  const initialMessageAdded = useRef(false);

  // Déclencher la sauvegarde quand tous les champs sont remplis
  useEffect(() => {
    if (Object.values(formData).every(field => field !== '')) {
      saveInteraction(formData)
        .then(() => console.log('Données sauvegardées !'))
        .catch(err => console.error('Erreur:', err));
    }
  }, [formData]);
  useEffect(() => {
    if (!initialMessageAdded.current) {
      setMessages(prev => [
        ...prev,
        { 
          text: "Bonjour ! Je suis l'assistant virtuel de Digital Market. Comment puis-je vous aider ?", 
          isBot: true 
        }
      ]);
      initialMessageAdded.current = true;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
  
    // Ajouter le message utilisateur immédiatement
    setMessages(prev => [...prev, { text: input, isBot: false }]);
    setInput('');
  
    try {
      const { reply, entities } = await sendMessageToChatbot(input);
      
      // Mettre à jour les données si des entités existent
      if (Object.values(entities).some(val => val)) {
        setFormData(prev => ({ ...prev, ...entities }));
      }
  
      // Ajouter la réponse du bot
      setMessages(prev => [...prev, { text: reply, isBot: true }]);
      
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "Erreur de communication avec le chatbot", 
        isBot: true 
      }]);
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
    <div key={index} className={`message-container ${msg.isBot ? 'bot' : 'user'}`}>
      <div className="message-avatar">
        <img 
          src={msg.isBot ? botIcon : userIcon} 
          alt={msg.isBot ? "Bot" : "Utilisateur"}
          className="avatar-icon"
        />
      </div>
      <div className={`message ${msg.isBot ? 'bot' : 'user'}`}>
        {msg.text}
      </div>
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