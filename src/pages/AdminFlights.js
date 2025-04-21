import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminFlights.css";

const API_URL = "http://localhost:1212/api";

const AdminFlights = ({ token }) => {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [airplanes, setAirplanes] = useState([]);
  const [newFlight, setNewFlight] = useState({
    airline: "",
    departureTime: "",
    arrivalTime: "",
    departureAirportId: "",
    arrivalAirportId: "",
    price: "",
    airplaneId: "",
  });
  const [editingFlightId, setEditingFlightId] = useState(null);

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";  // Redirect if no token
    } else {
      fetchFlights();
      fetchAirports();
      fetchAirplanes();
    }
  }, [token]);

  // Fetch flights from the backend
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

  // Fetch airports
  const fetchAirports = async () => {
    try {
      const res = await axios.get(`${API_URL}/airports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAirports(res.data);
    } catch (err) {
      console.error("Failed to fetch airports", err);
    }
  };

  // Fetch airplanes
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

  // Format date and time
  const formatDateTime = (dateTime) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateTime).toLocaleString(undefined, options);
  };

  // Get airport name by ID
  const getAirportNameById = (id) => {
    const airport = airports.find((airport) => airport.id === id);
    return airport ? airport.airportName : "Unknown Airport";
  };

  // Get airplane model by ID
  const getAirplaneModelById = (id) => {
    const airplane = airplanes.find((plane) => plane.airplaneId === id);
    return airplane ? airplane.model : "Unknown Airplane";
  };

  // Handle input changes for flight
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlight((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Add a new flight
  const handleAddFlight = async () => {
    try {
      await axios.post(`${API_URL}/flights`, newFlight, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFlights();  // Refresh the flights list
      setNewFlight({
        airline: "",
        departureTime: "",
        arrivalTime: "",
        departureAirportId: "",
        arrivalAirportId: "",
        price: "",
        airplaneId: "",
      }); // Reset form after adding
    } catch (err) {
      console.error("Failed to add flight", err);
    }
  };

  // Edit an existing flight
  const handleEditFlight = async () => {
    try {
      await axios.put(`${API_URL}/flights/${editingFlightId}`, newFlight, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFlights();  // Refresh the flights list
      setNewFlight({
        airline: "",
        departureTime: "",
        arrivalTime: "",
        departureAirportId: "",
        arrivalAirportId: "",
        price: "",
        airplaneId: "",
      });
      setEditingFlightId(null);  // Reset editing mode
    } catch (err) {
      console.error("Failed to update flight", err);
    }
  };

  // Delete a flight
  const handleDeleteFlight = async (id) => {
    try {
      await axios.delete(`${API_URL}/flights/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFlights();  // Refresh the flights list
    } catch (err) {
      console.error("Failed to delete flight", err);
    }
  };

  return (
    <div className="admin-flights-container">
      <h2>Manage Flights</h2>

      <div className="add-flight-form">
        <input
          type="text"
          name="airline"
          placeholder="Airline Name"
          value={newFlight.airline}
          onChange={handleInputChange}
        />
        <input
          type="datetime-local"
          name="departureTime"
          placeholder="Departure Time"
          value={newFlight.departureTime}
          onChange={handleInputChange}
        />
        <input
          type="datetime-local"
          name="arrivalTime"
          placeholder="Arrival Time"
          value={newFlight.arrivalTime}
          onChange={handleInputChange}
        />
        <select
          name="departureAirportId"
          value={newFlight.departureAirportId}
          onChange={handleInputChange}
        >
          <option value="">Select Departure Airport</option>
          {airports.map((airport) => (
            <option key={airport.id} value={airport.id}>
              {airport.airportName}
            </option>
          ))}
        </select>
        <select
          name="arrivalAirportId"
          value={newFlight.arrivalAirportId}
          onChange={handleInputChange}
        >
          <option value="">Select Arrival Airport</option>
          {airports.map((airport) => (
            <option key={airport.id} value={airport.id}>
              {airport.airportName}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newFlight.price}
          onChange={handleInputChange}
        />
        <select
          name="airplaneId"
          value={newFlight.airplaneId}
          onChange={handleInputChange}
        >
          <option value="">Select Airplane</option>
          {airplanes.map((plane) => (
            <option key={plane.airplaneId} value={plane.airplaneId}>
              {plane.model}
            </option>
          ))}
        </select>

        <button
          onClick={editingFlightId ? handleEditFlight : handleAddFlight}
          className={editingFlightId ? "update-btn" : "add-btn"}
        >
          {editingFlightId ? "✅ Update Flight" : "➕ Add Flight"}
        </button>

        {editingFlightId && (
          <button onClick={() => setEditingFlightId(null)} className="cancel-btn">
            ❌ Cancel
          </button>
        )}
      </div>

      <div className="flights-list">
        {flights.length === 0 ? (
          <p>No flights available.</p>
        ) : (
          flights.map((flight) => (
            <div key={flight.id} className="flight-card">
              <h3>{flight.airline}</h3>
              <p>
                <strong>Route:</strong>{" "}
                {getAirportNameById(flight.departureAirportId)} →{" "}
                {getAirportNameById(flight.arrivalAirportId)}
              </p>
              <p>
                <strong>Departure:</strong> {formatDateTime(flight.departureTime)}
              </p>
              <p>
                <strong>Arrival:</strong> {formatDateTime(flight.arrivalTime)}
              </p>
              <p>
                <strong>Airplane:</strong> {getAirplaneModelById(flight.airplaneId)}
              </p>
              <p>
                <strong>Price:</strong> ₹{flight.price.toLocaleString()}
              </p>

              <div className="action-buttons">
                <button
                  onClick={() => {
                    setEditingFlightId(flight.id);
                    setNewFlight({
                      airline: flight.airline,
                      departureTime: flight.departureTime,
                      arrivalTime: flight.arrivalTime,
                      departureAirportId: flight.departureAirportId,
                      arrivalAirportId: flight.arrivalAirportId,
                      price: flight.price,
                      airplaneId: flight.airplaneId,
                    });
                  }}
                >
                  ✏️ Edit
                </button>
                <button onClick={() => handleDeleteFlight(flight.id)}>🗑 Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminFlights;
