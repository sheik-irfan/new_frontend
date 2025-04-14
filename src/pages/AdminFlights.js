import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminFlights.css";

const API_URL = "http://localhost:1212/api";

const AdminFlights = ({ token }) => {
  const [flights, setFlights] = useState([]);
  const [newFlight, setNewFlight] = useState({
    flightNumber: "",
    source: "",
    destination: "",
    departureDate: "",
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
      setNewFlight({ flightNumber: "", source: "", destination: "", departureDate: "" });
    } catch (err) {
      alert("Failed to add flight");
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
        <button onClick={handleAddFlight}>Add Flight</button>
      </div>

      <ul className="flights-list">
        {flights.map((flight) => (
          <li key={flight.flightId}>
            ✈️ {flight.flightNumber} - {flight.source} → {flight.destination} on {flight.departureDate}
            <button onClick={() => handleDeleteFlight(flight.flightId)}>🗑 Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminFlights;
