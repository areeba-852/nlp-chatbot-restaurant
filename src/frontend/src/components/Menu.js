import React, { useState, useEffect } from "react";
import axios from "axios";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    available: true,
  });
  const [editMode, setEditMode] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await axios.get('http://localhost:5000/menu');
      console.log('response', response)
      setMenuItems(response.data.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const handleAddClick = () => {
    setShowForm(true);
    setEditMode(false);
    setNewMenuItem({
      name: "",
      description: "",
      price: 0,
      category: "",
      available: true,
    });
  };
  const saveMenuItem = async () => {
    try {
    if (editMode) {
      await axios.put(`http://localhost:5000/menu/${editingMenuId}`, newMenuItem);
    } else {
      await axios.post('http://localhost:5000/menu', newMenuItem);
    }
    fetchMenu();
    setShowForm(false);
  } catch (error) {
    console.error('Error saving order:', error);
  }
  };
  const handleEditClick = (item) => {
    setShowForm(true);
    setEditMode(true);
    setEditingMenuId(item._id);
    setNewMenuItem(item);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMenuItem(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/menu/${editingMenuId}`, newMenuItem);
      } else {
        await axios.post('http://localhost:5000/api/menu', newMenuItem);
      }
      fetchMenu();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleDeleteClick = async (menuId) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(`http://localhost:5000/menu/${menuId}`);
        fetchMenu();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Menu Management</h2>
        <button className="btn btn-primary" onClick={handleAddClick}>
          + Add Menu Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{editMode ? "Edit Menu Item" : "Add New Menu Item"}</h5>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Name"
                  value={newMenuItem.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Description"
                  value={newMenuItem.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  placeholder="Price"
                  value={newMenuItem.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="category"
                  className="form-control"
                  placeholder="Category (optional)"
                  value={newMenuItem.category}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="available"
                  checked={newMenuItem.available}
                  onChange={handleInputChange}
                />
                <label className="form-check-label">
                  Available
                </label>
              </div>

              {/* Buttons */}
              <button type="submit" className="btn btn-success me-2" onClick={saveMenuItem}>
                {editMode ? "Update" : "Save"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Menu Items Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.length > 0 ? (
              menuItems.map(item => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>{item.category || '-'}</td>
                  <td>{item.available ? "Yes" : "No"}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(item)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(item._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No menu items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Menu;
