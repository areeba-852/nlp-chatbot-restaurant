import { detectIntent } from '../services/dialogflowService.js';


export async function processTextQuery(req, res) {
  try {
    const { message, sessionId } = req.body;
    
    const response = await detectIntent(sessionId, message);

    // The response from Dialogflow contains the fulfillmentText (response from intent)
    res.json({
      fulfillmentText: response.fulfillmentText,  
      intent: response.intent.displayName,        
      parameters: response.parameters,            
      allRequiredParamsPresent: response.allRequiredParamsPresent, 
      outputContexts: response.outputContexts,    
    });
  } catch (error) {
    console.error('Error processing text query:', error);
    res.status(500).json({ error: 'Error processing your request' });
  }
}
