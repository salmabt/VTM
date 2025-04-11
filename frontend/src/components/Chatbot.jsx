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

  // Message de bienvenue au chargement
  useEffect(() => {
    const loadWelcomeMessage = async () => {
      const response = await sendMessageToChatbot('__WELCOME__');
      setMessages([{
        text: response.reply,
        isBot: true,
        richContent: response.richContent
      }]);
    };
    loadWelcomeMessage();
  }, []);

  const handleChipClick = (chipText) => {
    setInput(chipText);
    // Créer un événement factice pour soumettre le formulaire
    handleSubmit({ preventDefault: () => {} }, chipText);
  };

  const handleSubmit = async (e, customInput) => {
    e.preventDefault();
    const userInput = customInput || input;
    if (!userInput.trim()) return;

    // Ajouter le message utilisateur
    setMessages(prev => [...prev, { 
      text: userInput, 
      isBot: false 
    }]);
    
    if (!customInput) setInput('');

    try {
      const { reply, entities, richContent } = await sendMessageToChatbot(userInput);
      
      // Mettre à jour les données si des entités existent
      if (Object.values(entities).some(val => val)) {
        setFormData(prev => ({ ...prev, ...entities }));
      }

      // Ajouter la réponse du bot
      setMessages(prev => [...prev, { 
        text: reply, 
        isBot: true,
        richContent: richContent 
      }]);
      
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "Erreur de communication avec le chatbot", 
        isBot: true 
      }]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <h3>Digital Market Bot</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
            {msg.text}
            {msg.richContent && msg.richContent[0]?.options && (
              <div className="chips-container">
                {msg.richContent[0].options.map((option, i) => (
                  <button 
                    key={i}
                    className="chip"
                    onClick={() => handleChipClick(option.text)}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            )}
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