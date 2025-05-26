import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js'
import ngrok from 'ngrok';

dotenv.config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5000", 'http://localhost:3000'],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(json());
app.use(cookieParser());

try {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
console.log('MongoDB Connected');

} catch (err) {
  console.error(err.message);
  process.exit(1);
}
app.use('/', userRoutes)
// Start server
const PORT = process.env.PORT || 5000;
(async function() {
  console.log("Initializing Ngrok tunnel...");

  // Initialize ngrok using auth token and hostname
  const url = await ngrok.connect({
      proto: "http",
      // Your authtoken if you want your hostname to be the same everytime
      authtoken: "2uOyQoj1GFphdxzuT19QzqcZjNl_2SSkjmyRUhsu7uQZndppa",
      // Your hostname if you want your hostname to be the same everytime
      hostname: "",
      // Your app port
      addr: PORT,
  });

  console.log(`Listening on url ${url}`);
  console.log("Ngrok tunnel initialized!");
})();

/**
* Listen on port 3015
*/
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});