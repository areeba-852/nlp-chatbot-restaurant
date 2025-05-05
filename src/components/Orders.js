import React, { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    email: "",
    trackingNumber: "",
    items: [{ name: "", quantity: 1, price: 0 }],
    totalAmount: 0,
    status: "pending",
  });
  const [editMode, setEditMode] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/order'); // your real API
      console.log('response', response)
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
console.log('orders', orders)

  const handleSaveClick = async () => {
    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/order/${editingOrderId}`, newOrder);
      } else {
        await axios.post('http://localhost:5000/order', newOrder);
      }
      fetchOrders(); // refresh the list
      setShowForm(false); // hide form
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };
  const handleAddClick = () => {
    setShowForm(true);
    setEditMode(false);
    setNewOrder({
      email: "",
      trackingNumber: "",
      items: [{ name: "", quantity: 1, price: 0 }],
      totalAmount: 0,
      status: "pending",
    });
  };

  const handleEditClick = (order) => {
    setShowForm(true);
    setEditMode(true);
    setEditingOrderId(order._id);
    setNewOrder(order);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...newOrder.items];
    updatedItems[index][name] = name === 'quantity' || name === 'price' ? Number(value) : value;
    setNewOrder(prev => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleAddItem = () => {
    setNewOrder(prev => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: 1, price: 0 }],
    }));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = newOrder.items.filter((_, i) => i !== index);
    setNewOrder(prev => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/orders/${editingOrderId}`, newOrder);
      } else {
        await axios.post('http://localhost:5000/api/orders', newOrder);
      }
      fetchOrders();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleDeleteClick = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`http://localhost:5000/order/${orderId}`);
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Orders Management</h2>
        <button className="btn btn-primary" onClick={handleAddClick}>
          + Add Order
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{editMode ? "Edit Order" : "Add New Order"}</h5>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row mb-3">
                <div className="col-md-6">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Customer Email"
                    value={newOrder.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    name="trackingNumber"
                    className="form-control"
                    placeholder="Tracking Number"
                    value={newOrder.trackingNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Items */}
              <h6>Items:</h6>
              {newOrder.items.map((item, index) => (
                <div className="row mb-2" key={index}>
                  <div className="col-md-4">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Item Name"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      name="quantity"
                      className="form-control"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, e)}
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <button type="button" className="btn btn-danger" onClick={() => handleRemoveItem(index)}>Remove</button>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-secondary mb-3" onClick={handleAddItem}>+ Add Item</button>

              {/* Other Fields */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <input
                    type="number"
                    name="totalAmount"
                    className="form-control"
                    placeholder="Total Amount"
                    value={newOrder.totalAmount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <select
                    name="status"
                    className="form-control"
                    value={newOrder.status}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <button type="submit" className="btn btn-success me-2" onClick={handleSaveClick}>
                {editMode ? "Update" : "Save"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-primary">
            <tr>
              <th>Email</th>
              <th>Tracking #</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map(order => (
                <tr key={order._id}>
                  <td>{order.email}</td>
                  <td>{order.trackingNumber}</td>
                  <td>${order.totalAmount}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(order)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(order._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
