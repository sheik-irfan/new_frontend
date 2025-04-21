import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/AdminFlights.css";
import "animate.css";

const API_URL = "http://localhost:1212/api/admin";

const AdminFlights = ({ token }) => {
  const [flights, setFlights] = useState([]);
  const [editingFlightId, setEditingFlightId] = useState(null);
  const [newFlight, setNewFlight] = useState({
    airplaneId: "",
    departureAirportId: "",
    arrivalAirportId: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    airline: ""
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const handleAddFlight = async () => {
    try {
      await axios.post(`${API_URL}/flights`, newFlight, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFlights();
      resetForm();
    } catch (err) {
      alert("Failed to add flight");
      console.error(err);
    }
  };

  const handleEditFlight = (flight) => {
    setNewFlight({
      airplaneId: flight.airplaneId,
      departureAirportId: flight.fromAirportId,
      arrivalAirportId: flight.toAirportId,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      price: flight.price,
      airline: flight.airline
    });
    setEditingFlightId(flight.id);
  };

  const handleUpdateFlight = async () => {
    try {
      await axios.put(`${API_URL}/flights/${editingFlightId}`, newFlight, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFlights();
      resetForm();
    } catch (err) {
      alert("Failed to update flight");
      console.error(err);
    }
  };

  const handleDeleteFlight = async (id) => {
    try {
      await axios.delete(`${API_URL}/flights/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFlights();
    } catch (err) {
      alert("Failed to delete flight");
      console.error(err);
    }
  };

  const resetForm = () => {
    setNewFlight({
      airplaneId: "",
      departureAirportId: "",
      arrivalAirportId: "",
      departureTime: "",
      arrivalTime: "",
      price: "",
      airline: ""
    });
    setEditingFlightId(null);
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <div className={`admin-dashboard ${sidebarOpen ? "sidebar-open" : ""}`}>
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? "❮" : "❯"}
        </div>
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/adminflights">Manage Flights</Link></li>
          <li><Link to="/adminairplanes">Manage Airplanes</Link></li>
          <li><Link to="/adminairports">Manage Airports</Link></li>
          <li><Link to="/adminusers">Manage Users</Link></li>
          <li><Link to="/bookings">Bookings</Link></li>
        </ul>
      </aside>

      <main className="admin-main">
        <h1 className="animate__animated animate__fadeInDown">Manage Flights</h1>

        <div className="admin-section">
          <div className="add-flight-form">
            <input
              type="text"
              placeholder="Airline"
              value={newFlight.airline}
              onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value })}
            />
            <input
              type="number"
              placeholder="Airplane ID"
              value={newFlight.airplaneId}
              onChange={(e) => setNewFlight({ ...newFlight, airplaneId: e.target.value })}
            />
            <input
              type="number"
              placeholder="From Airport ID"
              value={newFlight.departureAirportId}
              onChange={(e) => setNewFlight({ ...newFlight, departureAirportId: e.target.value })}
            />
            <input
              type="number"
              placeholder="To Airport ID"
              value={newFlight.arrivalAirportId}
              onChange={(e) => setNewFlight({ ...newFlight, arrivalAirportId: e.target.value })}
            />
            <input
              type="datetime-local"
              value={newFlight.departureTime}
              onChange={(e) => setNewFlight({ ...newFlight, departureTime: e.target.value })}
            />
            <input
              type="datetime-local"
              value={newFlight.arrivalTime}
              onChange={(e) => setNewFlight({ ...newFlight, arrivalTime: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              value={newFlight.price}
              onChange={(e) => setNewFlight({ ...newFlight, price: e.target.value })}
            />

            <button
              onClick={editingFlightId ? handleUpdateFlight : handleAddFlight}
              className={editingFlightId ? "update-btn" : "add-btn"}
            >
              {editingFlightId ? "✅ Update Flight" : "➕ Add Flight"}
            </button>

            {editingFlightId && (
              <button className="cancel-btn" onClick={resetForm}>
                ❌ Cancel
              </button>
            )}
          </div>

          <ul className="flights-list">
            {flights.map((flight) => (
              <li key={flight.id}>
                ✈️ {flight.airline} <br />
                🛫 From: {flight.fromAirportName} (ID: {flight.fromAirportId}) <br />
                🛬 To: {flight.toAirportName} (ID: {flight.toAirportId}) <br />
                🕐 {flight.departureTime} → {flight.arrivalTime} <br />
                💰 ₹{flight.price}
                <div className="action-buttons">
                  <button onClick={() => handleEditFlight(flight)}>✏️ Edit</button>
                  <button onClick={() => handleDeleteFlight(flight.id)}>🗑 Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminFlights;
