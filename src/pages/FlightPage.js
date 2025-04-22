import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:1212/api/flights";

const FlightPage = ({ token }) => {
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFlights(res.data);
    } catch (err) {
      console.error("Failed to fetch flights", err);
      setError("❌ Could not load flights.");
    }
  };

  const handleBookClick = (flightId) => {
    navigate(`/booking/${flightId}`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>✈️ All Available Flights</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={cellStyle}>Airline</th>
            <th style={cellStyle}>From</th>
            <th style={cellStyle}>To</th>
            <th style={cellStyle}>Departure</th>
            <th style={cellStyle}>Arrival</th>
            <th style={cellStyle}>Price</th>
            <th style={cellStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.id}>
              <td style={cellStyle}>{flight.airline}</td>
              <td style={cellStyle}>{flight.fromAirportName || flight.departureAirportName}</td>
              <td style={cellStyle}>{flight.toAirportName || flight.arrivalAirportName}</td>
              <td style={cellStyle}>{new Date(flight.departureTime).toLocaleString()}</td>
              <td style={cellStyle}>{new Date(flight.arrivalTime).toLocaleString()}</td>
              <td style={cellStyle}>₹{flight.price.toLocaleString("en-IN")}</td>
              <td style={cellStyle}>
                <button
                  style={buttonStyle}
                  onClick={() => handleBookClick(flight.id)}
                >
                  Book
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const cellStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "center",
};

const buttonStyle = {
  padding: "6px 12px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default FlightPage;
