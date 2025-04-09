//Backend/routes/chatRoute
const express = require('express');
const { SessionsClient } = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
      const { message } = req.body;
      console.log('🔹 Message reçu du front:', message);
  
      const sessionId = uuid.v4();
      console.log('🔹 Session ID:', sessionId);
  
      const sessionClient = new SessionsClient();
      console.log('✅ SessionClient créé');
  
      const projectId = process.env.DIALOGFLOW_PROJECT_ID;
      console.log('🔹 DIALOGFLOW_PROJECT_ID:', projectId);
  
      const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);
      console.log('✅ SessionPath:', sessionPath);
  
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: message,
            languageCode: 'fr',
          },
        },
      };
  
      console.log('🔹 Requête envoyée à Dialogflow :', JSON.stringify(request, null, 2));
  
      const responses = await sessionClient.detectIntent(request);
      console.log('✅ Réponse Dialogflow:', responses);
  
      const result = responses[0].queryResult;
      console.log('🔹 Résultat:', result);
  
      res.json({ reply: result.fulfillmentText });
    } catch (error) {
      console.error('❌ Erreur dans le backend /api/chat :', error);
      res.status(500).json({ error: 'Erreur de communication avec le chatbot' });
    }
  });
  

module.exports = router;