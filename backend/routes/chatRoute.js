const express = require('express');
const { SessionsClient } = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const sessionId = uuid.v4();
    const sessionClient = new SessionsClient();
    const projectId = process.env.DIALOGFLOW_PROJECT_ID;
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
          languageCode: 'fr',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    // 🧠 Convertir les paramètres Dialogflow vers un objet JS
    const rawFields = result.parameters?.fields || {};
    const entities = {};
    // Conversion des champs Dialogflow vers les noms attendus
entities.nom_client = rawFields.nom_client?.stringValue || '';
entities.email = rawFields.email?.stringValue || '';
entities.service = rawFields.service?.stringValue || '';
entities.phone = rawFields.phone?.stringValue || '';
entities.title_de_livraison = rawFields.title_de_livraison?.stringValue || ''; // ⚠️ Corrigé
entities.description = rawFields.description?.stringValue || '';
    for (const key in rawFields) {
      if (rawFields[key].stringValue) {
        entities[key] = rawFields[key].stringValue;
      } else if (rawFields[key].numberValue) {
        entities[key] = rawFields[key].numberValue;
      } else if (rawFields[key].boolValue !== undefined) {
        entities[key] = rawFields[key].boolValue;
      }
    }

    // ✅ Retour complet vers le frontend
    res.json({ 
      reply: result.fulfillmentText,
      entities: entities 
    });

  } catch (error) {
    console.error('❌ Erreur dans le backend /api/chat :', error);
    res.status(500).json({ error: 'Erreur de communication avec le chatbot' });
  }
});

module.exports = router;
