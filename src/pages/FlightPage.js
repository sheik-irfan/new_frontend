// src/pages/FlightPage.js

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:1212/api/flights";

const FlightPage = ({ token }) => {
  const location = useLocation();
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");

  const searchResults = location.state?.searchResults || null;
  const searchCriteria = location.state?.searchCriteria || null;

  useEffect(() => {
    if (searchResults) {
      setFlights(searchResults);
    } else {
      fetchAllFlights();
    }
  }, []);

  const fetchAllFlights = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setFlights(res.data);
    } catch (err) {
      console.error("Failed to fetch flights", err);
      setError("❌ Could not load flights.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>✈️ {searchResults ? "Search Results" : "All Available Flights"}</h2>
      {searchCriteria && (
        <p style={{ marginBottom: "1rem", fontStyle: "italic" }}>
          Showing flights from <strong>{searchCriteria.source?.name || "Any"}</strong> to{" "}
          <strong>{searchCriteria.destination?.name || "Any"}</strong> on{" "}
          <strong>{searchCriteria.date || "Any Date"}</strong>
        </p>
      )}
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
          </tr>
        </thead>
        <tbody>
          {flights.map((flight) => (
            <tr key={flight.id}>
              <td style={cellStyle}>{flight.airline}</td>
              <td style={cellStyle}>
                {flight.fromAirportName || flight.departureAirportName}
              </td>
              <td style={cellStyle}>
                {flight.toAirportName || flight.arrivalAirportName}
              </td>
              <td style={cellStyle}>
                {new Date(flight.departureTime).toLocaleString()}
              </td>
              <td style={cellStyle}>
                {new Date(flight.arrivalTime).toLocaleString()}
              </td>
              <td style={cellStyle}>
                ₹{flight.price.toLocaleString("en-IN")}
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

export default FlightPage;
