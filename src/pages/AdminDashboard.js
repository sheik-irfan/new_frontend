// AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import "animate.css";
import AdminSidebar from "../components/AdminSidebar"; // Import AdminSidebar component

const API_URL = "http://localhost:1212/api";

const AdminDashboard = ({ token: propToken }) => {
  const [flights, setFlights] = useState([]);
  const [airplanes, setAirplanes] = useState([]);
  const [airports, setAirports] = useState([]);
  const [users, setUsers] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // State for sidebar toggle
  const navigate = useNavigate();

  const token = propToken || localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchFlights();
      fetchAirplanes();
      fetchAirports();
      fetchUsers();
    }
    // eslint-disable-next-line
  }, [token, navigate]);

  const fetchFlights = async () => {
    try {
      const res = await axios.get(`${API_URL}/flights`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      setAirplanes(res.data);
    } catch (err) {
      console.error("Failed to fetch airplanes:", err.response || err.message);
    }
  };

  const fetchAirports = async () => {
    try {
      const res = await axios.get(`${API_URL}/airports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAirports(res.data);
    } catch (err) {
      console.error("Failed to fetch airports:", err.response || err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err.response || err.message);
    }
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
    <div className={`admin-dashboard ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}>
      {/* Sidebar */}
      <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main */}
      <main className="admin-main">
        <h1 className="animate__animated animate__fadeInDown">🛠 Admin Dashboard</h1>

        {/* Flights */}
        <div className="admin-section">
          <h3>✈️ All Flights</h3>
          {flights.length === 0 ? (
            <p>No flights available.</p>
          ) : (
            flights.map((flight) => (
              <div key={flight.flightId || flight.id} className="admin-card">
                <h4>{flight.airline || flight.flightNumber || "Unknown Airline"}</h4>
                <p><strong>Route:</strong> {flight.fromAirportName || flight.source} → {flight.toAirportName || flight.destination}</p>
                <p><strong>Departure:</strong> {formatDateTime(flight.departureTime || flight.departureDate)}</p>
                <p><strong>Arrival:</strong> {formatDateTime(flight.arrivalTime)}</p>
                <p><strong>Price:</strong> ₹{flight.price?.toLocaleString() || "N/A"}</p>
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

        {/* Airports */}
        <div className="admin-section">
          <h3>🛬 All Airports</h3>
          {airports.length === 0 ? (
            <p>No airports found.</p>
          ) : (
            airports.map((airport) => (
              <div key={airport.airportId || airport.id} className="admin-card">
                <h4>{airport.airportName} ({airport.airportCode})</h4>
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
                <p>Role: {user.role || user.userole}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
