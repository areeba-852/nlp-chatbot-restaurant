import dialogflow from 'dialogflow';


// Create a new session

const textQuery = async (text, userID, parameters = {}) => {
  const projectID = process.env.GOOGLE_PROJECT_ID;
  const sessionID = process.env.DIALOGFLOW_SESSION_ID;
  const languageCode = process.env.DIALOGFLOW_LANGUAGE_CODE;
  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY
  };

  const sessionClient = new dialogflow.SessionsClient({ projectID, credentials });


  let sessionPath = sessionClient.sessionPath(projectID, sessionID + userID);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the Dialogflow agent
        text: text,
        // The language used by the client (en-US)
        languageCode: languageCode
      },
      queryParams: {
        payload: {
          data: parameters
        }
      }
    }
  };

  let responses = await sessionClient.detectIntent(request);
  responses = await handleAction(responses);
  return responses;
};

const handleAction = (responses) => {
  const queryResult = responses[0].queryResult;

  switch (queryResult.action) {
    case "recommendcourses-yes":
      if (queryResult.allRequiredParamsPresent) {
        saveRegistration(queryResult.parameters.fields);
      }
      break;
  }

  return responses;
};

// Exporting functions using ES6 export
export { textQuery, handleAction };
