import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import "animate.css";

const API_URL = "http://localhost:1212/api";

const AdminDashboard = ({ token: propToken }) => {
  const [flights, setFlights] = useState([]);
  const [airplanes, setAirplanes] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Retrieve token from props or localStorage
  const token = propToken || localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchFlights();
      fetchAirplanes();
      fetchUsers();
    }
    // eslint-disable-next-line
  }, [token, navigate]);

  const fetchFlights = async () => {
    try {
      const res = await axios.get(`${API_URL}/flights`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Flights fetched:", res.data);
      setFlights(res.data);
    } catch (err) {
      console.error("Failed to fetch flights:", err.response || err.message);
    }
  };

  const fetchAirplanes = async () => {
    try {
      const res = await axios.get(`${API_URL}/airplanes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Airplanes fetched:", res.data);
      setAirplanes(res.data);
    } catch (err) {
      console.error("Failed to fetch airplanes:", err.response || err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Users fetched:", res.data);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err.response || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTime).toLocaleString(undefined, options);
  };

  return (
    <div className="admin-dashboard animate__animated animate__fadeIn">
      <aside className="admin-sidebar animate__animated animate__fadeInLeft">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/dashboard">🏠 Main Dashboard</Link></li>
          <li><Link to="/adminflights">✈️ Manage Flights</Link></li>
          <li><Link to="/adminairplanes">🛫 Manage Airplanes</Link></li>
          <li><Link to="/adminairports">🛬 Manage Airports</Link></li>
          <li><Link to="/adminusers">👥 Manage Users</Link></li>
          <li><Link to="/wallet">💰 Wallets</Link></li>
          <li><Link to="/bookings">📄 Bookings</Link></li>
          <li><button className="admin-logout" onClick={handleLogout}>🚪 Logout</button></li>
        </ul>
      </aside>

      <main className="admin-main">
        <h1 className="animate__animated animate__fadeInDown">🛠 Admin Dashboard</h1>

        {/* Flights */}
        <div className="admin-section">
          <h3>✈️ All Flights</h3>
          {flights.length === 0 ? (
            <p>No flights available.</p>
          ) : (
            flights.map((flight) => (
              <div key={flight.id || flight._id} className="admin-card">
                <h4>{flight.airline || "Unknown Airline"}</h4>
                <p><strong>Route:</strong> {flight.fromAirportName} → {flight.toAirportName}</p>
                <p><strong>Departure:</strong> {formatDateTime(flight.departureTime)}</p>
                <p><strong>Arrival:</strong> {formatDateTime(flight.arrivalTime)}</p>
                <p><strong>Price:</strong> ₹{flight.price?.toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        {/* Airplanes */}
        <div className="admin-section">
          <h3>🛫 All Airplanes</h3>
          {airplanes.length === 0 ? (
            <p>No airplanes found.</p>
          ) : (
            airplanes.map((plane) => (
              <div key={plane.airplaneId || plane.id} className="admin-card">
                <h4>{plane.model}</h4>
                <p>Manufacturer: {plane.manufacturer}</p>
                <p>Capacity: {plane.capacity}</p>
              </div>
            ))
          )}
        </div>

        {/* Users */}
        <div className="admin-section">
          <h3>👥 All Users</h3>
          {users.length === 0 ? (
            <p>No users registered.</p>
          ) : (
            users.map((user) => (
              <div key={user.userId || user.id} className="admin-card">
                <h4>{user.userName}</h4>
                <p>Email: {user.userEmail}</p>
                <p>Role: {user.role}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
