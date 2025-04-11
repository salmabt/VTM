//Backend/routes/chatRoute
const express = require('express');
const { SessionsClient } = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, sessionId = uuid.v4() } = req.body;
    
    const sessionClient = new SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
      process.env.DIALOGFLOW_PROJECT_ID, 
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'fr',
        },
      },
    };

    const [response] = await sessionClient.detectIntent(request);
    const result = response.queryResult;

    // Format complet avec extraction des paramètres
    const entities = {};
    if (result.parameters && result.parameters.fields) {
      Object.entries(result.parameters.fields).forEach(([key, value]) => {
        entities[key] = value.stringValue || '';
      });
    }

   // Extraction des options (chips)
    let richContent = null;
    result.fulfillmentMessages?.forEach(msg => {
      if (msg.payload) {
        try {
          const payload = JSON.parse(JSON.stringify(msg.payload)); // Conversion sécurisée
          if (payload.richContent) {
            richContent = payload.richContent;
          }
        } catch (e) {
          console.error('Erreur de parsing du payload:', e);
        }
      }
    });
  
    res.json({ 
      reply: result.fulfillmentText || "Je n'ai pas compris",
      entities,
      intent: result.intent?.displayName || 'unknown',
      richContent: richContent 
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ 
      reply: "Service temporairement indisponible",
      entities: {},
      intent: 'error'
    });
  }
});

module.exports = router;