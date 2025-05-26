import dialogflow from 'dialogflow';
import path from 'path';

const { SessionsClient } = dialogflow;

const sessionClient = new SessionsClient({
  keyFilename: path.resolve('config/chatbot-xbtr-key.json'),
});

const projectId = 'chatbot-xbtr-456002'; // ✅ project ID

async function detectIntent(sessionId, text) {
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text,
        languageCode: 'en',
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    return result;
  } catch (error) {
    console.error('Dialogflow error:', error);
    throw new Error('Error detecting intent');
  }
}

export { detectIntent };
