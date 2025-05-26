import Order from '../model/Order.js';
import mongoose from 'mongoose';

export const addOrUpdateOrder = async (req, res) => {
    console.log('first')
    console.log('req.body', req.body)
  const { _id, email, trackingNumber, items, totalAmount, status } = req.body;

  try {
    const order = await Order.findOneAndUpdate(
      { _id: _id || new mongoose.Types.ObjectId() },
      { email, trackingNumber, items, totalAmount, status },
      { new: true, upsert: true }
    );
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const result = await Order.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getOrderItems = async (req, res) => {
    try {
      const orderItems = await Order.find();
      if (orderItems.length === 0) {
        return res.status(404).json({ success: false, message: 'No order items found' });
      }
      console.log('orderItems', orderItems)
      res.status(200).json({ success: true, data: orderItems });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching order items', error: err.message });
    }
  };
