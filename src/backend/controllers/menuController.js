import MenuItem from '../model/Menu.js';
import mongoose from 'mongoose';

// Add or Update
export const upsertMenuItem = async (req, res) => {
    console.log('req.body1', req.body)
  const { _id, name, description, price, category, available } = req.body;

  try {
    const item = await MenuItem.findOneAndUpdate(
      { _id: _id || new mongoose.Types.ObjectId() },
      { name, description, price, category, available },
      { new: true, upsert: true }
    );
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error saving item' });
  }
};

// Delete
export const deleteMenuItem = async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.json({ success: true, message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting item' });
  }
};

export const getMenuItems = async (req, res) => {
    try {
      const menuItems = await MenuItem.find();
      if (menuItems.length === 0) {
        return res.status(404).json({ success: false, message: 'No menu items found' });
      }
      console.log('menuItems', menuItems)
      res.status(200).json({ success: true, data: menuItems });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching menu items', error: err.message });
    }
  };
