// components/AdminFlights.js

import React, { useEffect, useState } from "react";
import { fetchFlights, fetchAirports, fetchAirplanes, addFlight, updateFlight, deleteFlight } from "../services/AdminFlightsService";
import { defaultFlight } from "../models/AdminFlightsModel";
import "../styles/AdminFlights.css";

const AdminFlights = ({ token }) => {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [airplanes, setAirplanes] = useState([]);
  const [editingFlightId, setEditingFlightId] = useState(null);
  const [newFlight, setNewFlight] = useState(defaultFlight);

  useEffect(() => {
    if (token) {
      fetchFlightsData();
    }
  }, [token]);

  const fetchFlightsData = async () => {
    try {
      const flightRes = await fetchFlights(token);
      setFlights(flightRes.data);

      const airportRes = await fetchAirports(token);
      setAirports(airportRes.data);

      const airplaneRes = await fetchAirplanes(token);
      setAirplanes(airplaneRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const handleAddFlight = async () => {
    try {
      const flightToSend = {
        ...newFlight,
        airplaneId: parseInt(newFlight.airplaneId),
        departureAirportId: parseInt(newFlight.departureAirportId),
        arrivalAirportId: parseInt(newFlight.arrivalAirportId),
        price: parseFloat(newFlight.price),
      };

      await addFlight(token, flightToSend);
      fetchFlightsData();
      resetForm();
    } catch (err) {
      alert("Failed to add flight");
      console.error(err);
    }
  };

  const handleEditFlight = (flight) => {
    setNewFlight({ ...flight });
    setEditingFlightId(flight.id);
  };

  const handleUpdateFlight = async () => {
    try {
      const updatedFlight = {
        ...newFlight,
        airplaneId: parseInt(newFlight.airplaneId),
        departureAirportId: parseInt(newFlight.departureAirportId),
        arrivalAirportId: parseInt(newFlight.arrivalAirportId),
        price: parseFloat(newFlight.price),
      };

      await updateFlight(token, editingFlightId, updatedFlight);
      fetchFlightsData();
      resetForm();
    } catch (err) {
      alert("Failed to update flight");
      console.error(err);
    }
  };

  const handleDeleteFlight = async (id) => {
    try {
      await deleteFlight(token, id);
      fetchFlightsData();
    } catch (err) {
      alert("Failed to delete flight");
    }
  };

  const resetForm = () => {
    setNewFlight(defaultFlight);
    setEditingFlightId(null);
  };

  const getAirportNameById = (id) => {
    const airport = airports.find((a) => a.id === id);
    return airport ? airport.airportName : "Unknown Airport";
  };

  const getAirplaneById = (id) => {
    return airplanes.find((plane) => plane.airplaneId === id);
  };

  return (
    <div className="admin-flights-container">
      <h2>Manage Flights</h2>

      <div className="add-flight-form">
        <input
          type="text"
          placeholder="Airline"
          value={newFlight.airline}
          onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value })}
        />

        <select
          value={newFlight.airplaneId}
          onChange={(e) => setNewFlight({ ...newFlight, airplaneId: e.target.value })}
        >
          <option value="">Select Airplane</option>
          {airplanes.map((airplane) => (
            <option key={airplane.airplaneId} value={airplane.airplaneId}>
              {airplane.airplaneName} - {airplane.airplaneModel} ({airplane.manufacturer})
            </option>
          ))}
        </select>

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
          placeholder="Departure Airport ID"
          value={newFlight.departureAirportId}
          onChange={(e) => setNewFlight({ ...newFlight, departureAirportId: e.target.value })}
        />
        <input
          type="number"
          placeholder="Arrival Airport ID"
          value={newFlight.arrivalAirportId}
          onChange={(e) => setNewFlight({ ...newFlight, arrivalAirportId: e.target.value })}
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

      <div className="flights-list">
        {flights.map((flight) => {
          const airplane = getAirplaneById(flight.airplaneId);
          return (
            <div key={flight.id} className="flight-card">
              <div className="flight-details">
                <h3>✈️ {flight.airline}</h3>
                <p><strong>From:</strong> {getAirportNameById(flight.departureAirportId)}</p>
                <p><strong>To:</strong> {getAirportNameById(flight.arrivalAirportId)}</p>
                <p><strong>Departure:</strong> {flight.departureTime}</p>
                <p><strong>Arrival:</strong> {flight.arrivalTime}</p>
                <p>
                  <strong>Airplane:</strong>{" "}
                  {airplane ? `${airplane.airplaneName} - ${airplane.airplaneModel} (${airplane.manufacturer})` : `Unknown (ID: ${flight.airplaneId})`}
                </p>
                <p><strong>Price:</strong> ₹{flight.price}</p>
              </div>

              <div className="action-buttons">
                <button onClick={() => handleEditFlight(flight)}>✏️ Edit</button>
                <button onClick={() => handleDeleteFlight(flight.id)}>🗑 Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminFlights;
