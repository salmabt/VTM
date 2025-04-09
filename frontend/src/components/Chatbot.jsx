//frontend/components/Chatbot.jsx
import React, { useState } from 'react';
import { sendMessageToChatbot } from '../api/chatbotApi'; // 🔁 Import de la fonction
import '../styles/Chatbot.css';


const Chatbot = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const data = await sendMessageToChatbot(input);

      setMessages((prev) => [
        ...prev,
        { text: input, isBot: false },
        { text: data.reply, isBot: true }
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
