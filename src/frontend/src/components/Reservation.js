import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TableReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    memberNumber: '',
    date: '',
    time: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/reservation');
      console.log('res', res)
      setReservations(res.data.data);
    } catch (err) {
      console.error('Error fetching reservations:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setFormVisible(true);
    setEditMode(false);
    setFormData({ memberNumber: '', date: '', time: '' });
  };

  const handleEditClick = (reservation) => {
    setFormVisible(true);
    setEditMode(true);
    setEditingId(reservation._id);
    setFormData({
      _id: reservation._id,
      memberNumber: reservation.memberNumber,
      date: reservation.date,
      time: reservation.time
    });
  };

  const handleCancel = () => {
    setFormVisible(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      try {
        await axios.delete(`http://localhost:5000/reservation/${id}`);
        fetchReservations();
      } catch (error) {
        console.error("Error deleting reservation:", error);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.post(`http://localhost:5000/reservation`, formData);
      } else {
        await axios.post('http://localhost:5000/reservation', formData);
      }
      fetchReservations();
      setFormVisible(false);
    } catch (error) {
      console.error("Error saving reservation:", error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Table Reservations</h2>
        <button className="btn btn-primary" onClick={handleAddClick}>
          + Add Reservation
        </button>
      </div>

      {formVisible && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{editMode ? 'Edit Reservation' : 'Add New Reservation'}</h5>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  name="memberNumber"
                  className="form-control"
                  placeholder="Member Number"
                  value={formData.memberNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="time"
                  name="time"
                  className="form-control"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-success me-2">
                {editMode ? 'Update' : 'Save'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reservation Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-primary">
            <tr>
              <th>Member Number</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length > 0 ? (
              reservations.map(reservation => (
                <tr key={reservation._id}>
                  <td>{reservation.memberNumber}</td>
                  <td>{reservation.date}</td>
                  <td>{reservation.time}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditClick(reservation)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(reservation._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No reservations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableReservations;
