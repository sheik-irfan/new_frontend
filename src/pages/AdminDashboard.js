// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import "animate.css";

const API_URL = "http://localhost:1212/api";

const AdminDashboard = ({ token }) => {
  const [flights, setFlights] = useState([]);
  const [airplanes, setAirplanes] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchFlights();
      fetchAirplanes();
      fetchUsers();
    }
  }, [token, navigate]);

  const fetchFlights = async () => {
    try {
      const res = await axios.get(`${API_URL}/flights`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights(res.data);
    } catch (err) {
      console.error("Failed to fetch flights", err);
    }
  };

  const fetchAirplanes = async () => {
    try {
      const res = await axios.get(`${API_URL}/airplanes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAirplanes(res.data);
    } catch (err) {
      console.error("Failed to fetch airplanes", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard animate__animated animate__fadeIn">
      <aside className="admin-sidebar animate__animated animate__fadeInLeft">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/dashboard">🏠 Main Dashboard</Link></li>
          <li><Link to="/flights">✈️ Manage Flights</Link></li>
          <li><Link to="/airplanes">🛬 Manage Airplanes</Link></li>
          <li><Link to="/airports">🛫 Manage Airports</Link></li>
          <li><Link to="/wallet">💰 Wallets</Link></li>
          <li><Link to="/bookings">📄 Bookings</Link></li>
          <li><button className="admin-logout" onClick={handleLogout}>🚪 Logout</button></li>
        </ul>
      </aside>

      <main className="admin-main">
        <h1 className="animate__animated animate__fadeInDown">🛠 Admin Dashboard</h1>

        <div className="admin-section">
          <h3>All Flights</h3>
          {flights.map((flight) => (
            <div key={flight.flightId} className="admin-card">
              <h4>{flight.flightNumber}</h4>
              <p>{flight.source} → {flight.destination}</p>
              <p>Departure: {flight.departureDate}</p>
            </div>
          ))}
        </div>

        <div className="admin-section">
          <h3>All Airplanes</h3>
          {airplanes.map((plane) => (
            <div key={plane.airplaneId} className="admin-card">
              <h4>{plane.model}</h4>
              <p>Manufacturer: {plane.manufacturer}</p>
              <p>Capacity: {plane.capacity}</p>
            </div>
          ))}
        </div>

        <div className="admin-section">
          <h3>All Users</h3>
          {users.map((user) => (
            <div key={user.userId} className="admin-card">
              <h4>{user.userName}</h4>
              <p>Email: {user.userEmail}</p>
              <p>Role: {user.role}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
