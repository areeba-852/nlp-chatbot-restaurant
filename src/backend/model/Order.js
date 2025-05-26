import mongoose from 'mongoose';

const order = new mongoose.Schema({
  email: { type: String, required: true },               // Customer's email
  trackingNumber: { type: String, required: true },      // Unique tracking number
  items: [                                               // List of items in the order
    {
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: { type: Number, required: true },         // Total order cost
  status: {
    type: String,
    enum: ['pending', 'processing', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }

});

const Order = mongoose.model('Order', order);
export default Order;
