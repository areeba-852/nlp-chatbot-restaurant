import express from "express";
import {
  Signup,
  Login,
  getMe,
  updateProfile,
  logout,
} from "../controllers/userController.js";
import {
  upsertMenuItem,
  deleteMenuItem,
  getMenuItems,
} from "../controllers/menuController.js";
import {
  upsertReservation,
  deleteReservation,
  getReservations,
} from "../controllers/reservationController.js";
import {
  addOrUpdateOrder,
  deleteOrder,
  getOrderItems,
} from "../controllers/orderController.js";
import Menu from "../model/Menu.js";
import Order from "../model/Order.js";
import { textQuery } from "../chatbot/chatbot.js";
import { protect } from "../middleware/auth.js";
import Reservation from "../model/Reservation.js";
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/", getMe);
router.get("/verify", protect, (req, res) => {
  // If we reach here, it means the user is authenticated
  res.json({
    message: "User is authenticated",
    user: req.user, // You can send back the user data if needed
  });
});
router.get("/logout", logout);
router.post("/update-profile", protect, updateProfile);
router.post("/api/df_text_query", async (req, res) => {
  let responses = await textQuery(
    req.body.text,
    req.body.userID,
    req.body.parameters
  );
  return res.send(responses[0].queryResult);
});
router.post("/webhook", async (req, res) => {
  try {
    console.log("req.body", req.body);
    const intent = req.body.queryResult.intent.displayName;

    if (intent === "Restaurant.track.order") {
      const parameters = req.body.queryResult.parameters;
      const email = parameters.email;
      const number = parameters.number;

      let query = {};

      // Dynamically build query based on available parameters
      if (email) query.email = email;
      if (number) query.trackingNumber = number;

      let responseText =
        "Please provide an email or tracking number to search for your order.";

      if (Object.keys(query).length > 0) {
        const order = await Order.findOne(query);

        if (order) {
          responseText = `Your order with number ${order.trackingNumber} is currently ${order.status}.`;
        } else {
          responseText = `Sorry, we couldn't find an order matching the provided information.`;
        }
      }

      res.json({
        fulfillmentText: responseText,
      });
    } else if (intent === "Restaurant.Menu") {
      const menuItems = await Menu.find({});
      const fulfillmentMessages = menuItems.map((element) => ({
        text: { text: [`${element.name}: ${element.description}`] },
      }));
      res.json({
        fulfillmentMessages: fulfillmentMessages,
      });
    } else if (intent === "Restaurant.Create.Order") {
      const parameters = req.body.queryResult.parameters;
      const item = parameters.item;
      const quantity = parameters.quantity;
      const email = parameters.email;

      // Get all menu item names
      const menuItem = await Menu.findOne({ name: item });

      // Validate item
      if (!item || !quantity) {
        return res.json({
          fulfillmentText:
            "Please provide both item and quantity to place an order.",
        });
      }

      if (!menuItem) {
        return res.json({
          fulfillmentText: `Sorry, we don't have "${item}" on the menu. Would you like to hear the available items?`,
        });
      }
      const trackingNumber = `ORD${Date.now()}`;
      let orderDetails = [
        {
          name: menuItem.name,
          quantity: quantity,
          price: menuItem.price,
        },
      ];
      const newOrder = new Order({
        email: email,
        trackingNumber: trackingNumber,
        items: orderDetails,
        totalAmount: menuItem.price * quantity,
        status: "pending",
      });

      await newOrder.save();

      return res.json({
        fulfillmentMessages: [
          {
            text: {
              text: [`Your order for ${quantity} ${item}(s) has been placed.`],
            },
          },
          { text: { text: ["We’ll notify you when it’s ready. Thank you!"] } },
        ],
      });
    } else if (intent === "Restaurant.booking.create") {
      const parameters = req.body.queryResult.parameters;
      console.log("parameters", parameters);
      const guests = parameters.guests;
      const email = parameters.email;
      const date_time = parameters.date_time;
      const dateObj = new Date(date_time.date_time);
      // Extract date and time
      const date = dateObj.toISOString().split("T")[0]; // 'YYYY-MM-DD'
      const time = dateObj.toTimeString().split(" ")[0]; // 'HH:MM:SS'

      const newReservation = new Reservation({
        email: email,
        date: date,
        memberNumber: guests,
        time: time,
      });

      await newReservation.save();

      return res.json({
        fulfillmentMessages: [
          {
            text: {
              text: [
                `Your reservation for ${guests} at ${date_time.date_time} with ${email} has been placed.`,
              ],
            },
          },
          { text: { text: ["We’ll notify you when it’s ready. Thank you!"] } },
        ],
      });
    } else if (intent === "Restaurant.booking.delete") {
      const parameters = req.body.queryResult.parameters;
      console.log("parameters", parameters);

      const guests = parameters.guests;
      const email = parameters.email;
      const date_time = parameters.date_time;

      const dateObj = new Date(date_time.date_time);
      const date = dateObj.toISOString().split("T")[0]; // 'YYYY-MM-DD'
      const time = dateObj.toTimeString().split(" ")[0]; // 'HH:MM:SS'

      const deletedReservation = await Reservation.findOneAndDelete({
        email: email,
        date: date,
        time: time,
        memberNumber: guests, // optional: include if guest number is required to match
      });
      console.log('deletedReservation', deletedReservation)

      if (deletedReservation) {
        return res.json({
          fulfillmentMessages: [
            {
              text: {
                text: [
                  `Your reservation for ${guests} guest(s) on ${date} at ${time} has been successfully canceled.`,
                ],
              },
            },
          ],
        });
      } else {
        return res.json({
          fulfillmentMessages: [
            {
              text: {
                text: [
                  `We couldn't find any reservation matching the provided details.`,
                ],
              },
            },
          ],
        });
      }
    } else if (intent === "Restaurant.booking.status") {
  const parameters = req.body.queryResult.parameters;
  const guests = parameters.guests;
  const email = parameters.email;
  const date_time = parameters.date_time;

  const dateObj = new Date(date_time.date_time);
  const date = dateObj.toISOString().split("T")[0]; // 'YYYY-MM-DD'
  const time = dateObj.toTimeString().split(" ")[0]; // 'HH:MM:SS'

  // Find reservation
  const reservation = await Reservation.findOne({
    email: email,
    date: date,
    time: time,
    memberNumber: guests,
  });

  if (reservation) {
    return res.json({
      fulfillmentMessages: [
        {
          text: {
            text: [
              `Yes, your reservation for ${guests} guest(s) on ${date} at ${time} is confirmed.`,
            ],
          },
        },
      ],
    });
  } else {
    return res.json({
      fulfillmentMessages: [
        {
          text: {
            text: [
              `We couldn't find a reservation matching those details. Please double-check your information.`,
            ],
          },
        },
      ],
    });
  }
} else {
      res.json({
        fulfillmentText: "Sorry, I couldn't understand that request.",
      });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.json({
      fulfillmentText: "An error occurred while processing your request.",
    });
  }
});
router.post("/menu/", upsertMenuItem);
router.get("/menu/", getMenuItems);
router.delete("/menu/:id", deleteMenuItem);
router.post("/reservation/", upsertReservation);
router.delete("/reservation/:id", deleteReservation);
router.get("/reservation/", getReservations);
router.post("/order/", addOrUpdateOrder);
router.get("/order/", getOrderItems);
router.delete("/order/:id", deleteOrder);

export default router;
