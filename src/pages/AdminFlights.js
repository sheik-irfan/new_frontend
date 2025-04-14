import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminFlights.css";
 
const API_URL = "http://localhost:1212/api";
 
const AdminFlights = ({ token }) => {
  const [flights, setFlights] = useState([]);
  const [editingFlightId, setEditingFlightId] = useState(null);
  const [newFlight, setNewFlight] = useState({
    flightNumber: "",
    source: "",
    destination: "",
    departureDate: "",
    departureTime: "",
    arrivalTime: "",
    airplaneId: "",
    price: ""
  });
 
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
    }
  };
 
  const handleEditFlight = (flight) => {
    setNewFlight({ ...flight });
    setEditingFlightId(flight.flightId);
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
    }
  };
 
  const resetForm = () => {
    setNewFlight({
      flightNumber: "",
      source: "",
      destination: "",
      departureDate: "",
      departureTime: "",
      arrivalTime: "",
      airplaneId: "",
      price: ""
    });
    setEditingFlightId(null);
  };
 
  useEffect(() => {
    fetchFlights();
  }, []);
 
  return (
    <div className="admin-flights-container">
      <h2>Manage Flights</h2>
 
      <div className="add-flight-form">
        <input
          type="text"
          placeholder="Flight Number"
          value={newFlight.flightNumber}
          onChange={(e) => setNewFlight({ ...newFlight, flightNumber: e.target.value })}
        />
        <input
          type="text"
          placeholder="Source"
          value={newFlight.source}
          onChange={(e) => setNewFlight({ ...newFlight, source: e.target.value })}
        />
        <input
          type="text"
          placeholder="Destination"
          value={newFlight.destination}
          onChange={(e) => setNewFlight({ ...newFlight, destination: e.target.value })}
        />
        <input
          type="date"
          value={newFlight.departureDate}
          onChange={(e) => setNewFlight({ ...newFlight, departureDate: e.target.value })}
        />
        <input
          type="time"
          placeholder="Departure Time"
          value={newFlight.departureTime}
          onChange={(e) => setNewFlight({ ...newFlight, departureTime: e.target.value })}
        />
        <input
          type="time"
          placeholder="Arrival Time"
          value={newFlight.arrivalTime}
          onChange={(e) => setNewFlight({ ...newFlight, arrivalTime: e.target.value })}
        />
        <input
          type="number"
          placeholder="Airplane ID"
          value={newFlight.airplaneId}
          onChange={(e) => setNewFlight({ ...newFlight, airplaneId: e.target.value })}
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
          <li key={flight.flightId}>
            ✈️ {flight.flightNumber} - {flight.source} → {flight.destination} <br />
            🕐 {flight.departureDate} | {flight.departureTime} - {flight.arrivalTime} <br />
            💺 Airplane ID: {flight.airplaneId} | 💰 Price: ₹{flight.price}
            <div className="action-buttons">
              <button onClick={() => handleEditFlight(flight)}>✏️ Edit</button>
              <button onClick={() => handleDeleteFlight(flight.flightId)}>🗑 Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
 
export default AdminFlights;