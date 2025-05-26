import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  email: { type: String, required: true },               // Customer's email
  memberNumber: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
});

export default mongoose.model('Reservation', reservationSchema);
