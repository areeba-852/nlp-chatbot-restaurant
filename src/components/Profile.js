import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    newUsername: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { oldPassword, newPassword, confirmNewPassword, newUsername } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match", {
        position: "bottom-left",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/update-profile",
        {
          oldPassword,
          newPassword,
          newUsername,
        },
        { withCredentials: true }
      );

      const { success, message } = response.data;
      if (success) {
        toast.success(message, {
          position: "bottom-left",
        });
        // Optionally, redirect user to another page after success
        setTimeout(() => {
          navigate("/profile"); // or "/home"
        }, 1000);
      } else {
        toast.error(message, {
          position: "bottom-left",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("There was an error updating your profile.", {
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Profile Management</h2>
      <form onSubmit={handleSubmit} className="form-group">
        <div className="mb-3">
          <label htmlFor="oldPassword" className="form-label">
            Old Password
          </label>
          <input
            type="password"
            className="form-control"
            id="oldPassword"
            name="oldPassword"
            value={oldPassword}
            onChange={handleChange}
            placeholder="Enter your old password"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmNewPassword" className="form-label">
            Confirm New Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmNewPassword"
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="newUsername" className="form-label">
            New Username
          </label>
          <input
            type="text"
            className="form-control"
            id="newUsername"
            name="newUsername"
            value={newUsername}
            onChange={handleChange}
            placeholder="Enter new username (optional)"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Profile;
