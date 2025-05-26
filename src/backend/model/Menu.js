import mongoose from 'mongoose';

const menu = new mongoose.Schema({
  name: { type: String, required: true },      // Name of the menu item
  description: { type: String },               // Optional description
  price: { type: Number, required: true },     // Price of the item
  category: { type: String },                  // E.g., appetizer, main course, etc.
  available: { type: Boolean, default: true }  // Is the item currently available?
});

const Menu = mongoose.model('Menu', menu);
export default Menu;
