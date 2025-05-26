import Menu from "../model/Menu.js";
import Order from "../model/Order.js";
import {textQuery} from "../chatbot/chatbot.js"; // Import the chatbot module using ES6 syntax

const dialogflowRoutes = (app) => {
  app.post("/api/df_text_query", async (req, res) => {
    console.log('req.body.........', req.body);

    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Number regex (can be just digits, or adjust for phone formats)
    const numberRegex = /^\d+$/;

    if (emailRegex.test(req.body.text)) {
      const order = await Order.findOne({ email: req.body.text });
      const fulfillmentMessages = [{ text: { text: [order.status] } }];
      return res.send({ fulfillmentMessages });
    }

    if (numberRegex.test(req.body.text)) {
      const order = await Order.findOne({ trackingNumber: req.body.text });
      const fulfillmentMessages = [{ text: { text: [order.status] } }];
      return res.send({ fulfillmentMessages });
    }

    if (req.body.text === "menu" || req.body.text === "items") {
      const menuItems = await Menu.find({});
      const fulfillmentMessages = menuItems.map(element => ({
        text: { text: [`${element.name}: ${element.description}`] }
      }));
      console.log('fulfillmentMessages', fulfillmentMessages)
      return res.send({ fulfillmentMessages });
    } else {
      let responses = await textQuery(
        req.body.text,
        req.body.userID,
        req.body.parameters
      );
      console.log('responses===============', responses[0].queryResult);
      return res.send(responses[0].queryResult);
    }
  });
};

export default dialogflowRoutes;  // Export the dialogflowRoutes function using ES6 export
