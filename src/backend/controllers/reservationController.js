import Reservation from '../model/Reservation.js';
import mongoose from 'mongoose';

// Add or Update Reservation
export const upsertReservation = async (req, res) => {
  const { _id, memberNumber, date, time } = req.body;

  try {
    const reservation = await Reservation.findOneAndUpdate(
      { _id: _id || new mongoose.Types.ObjectId() },
      { memberNumber, date, time },
      { new: true, upsert: true }
    );
    res.json({ success: true, reservation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error saving reservation' });
  }
};

// Delete Reservation
export const deleteReservation = async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Reservation not found' });
    res.json({ success: true, message: 'Reservation deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting reservation' });
  }
};

export const getReservations = async (req, res) => {
    try {
      const reservations = await Reservation.find();
      if (reservations.length === 0) {
        return res.status(404).json({ success: false, message: 'No reservations found' });
      }
      console.log('reaservation', reservations)
      res.status(200).json({ success: true, data: reservations });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching reservations', error: err.message });
    }
  };
