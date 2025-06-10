import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Orders from "./Orders";
import Menu from "./Menu";
import Reservation from "./Reservation";
import Profile from "./Profile";
import axios from "axios";

const Layout = () => {
  const navigate = useNavigate();

  const [selectedMenu, setSelectedMenu] = useState("dashboard");

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };
const username = localStorage.getItem("username");
const handleSignOut = () => {
  axios.get("http://localhost:5000/logout", {
    withCredentials: true, // Ensure credentials (cookies) are sent
  })
  .then((res) => {
    console.log('res', res)
    if (res.data.message) {
      navigate("/login"); // Redirect to home if logged in
    }
  })
};
  return (
    <div className="d-flex flex-column vh-100">
      {/* Header */}
      <header className="bg-primary text-white p-3 d-flex justify-content-between align-items-center">
        <h4 className="m-0">Arnab Restaurant</h4>

        {/* Profile Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            id="profileDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {username}
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
            {/* <li>
              <Link className="dropdown-item" to="/profile">Profile</Link>
            </li> */}
            <li>
              <button className="dropdown-item" onClick={handleSignOut}>
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </header>

      {/* Content Area */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <nav className="bg-light p-3" >
          <ul className="nav flex-column">
            <li className="nav-item">
              <button className="nav-link btn btn-link text-start" onClick={() => handleMenuClick("dashboard")}>
                Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-start" onClick={() => handleMenuClick("orders")}>
                Orders
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-start" onClick={() => handleMenuClick("menu")}>
                Menu
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-start" onClick={() => handleMenuClick("reservations")}>
                Reservations
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-start" onClick={() => handleMenuClick("profile")}>
                Profile
              </button>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-grow-1 p-4" style={{ width: "1280px" }}>
          {selectedMenu === "dashboard" && (
            <>
              <h2>Dashboard</h2>
              <p>Welcome to the dashboard.</p>
            </>
          )}
          {selectedMenu === "orders" && <Orders />}
          {selectedMenu === "menu" && <Menu />}
          {selectedMenu === "reservations" && <Reservation />}
          {selectedMenu === "profile" && <Profile />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
