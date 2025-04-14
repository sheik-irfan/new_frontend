import React, { useEffect, useState } from "react";
import axios from "axios";
import "animate.css";

const API_URL = "http://localhost:1212/api";

const Airports = ({ token: propToken }) => {
  const [airports, setAirports] = useState([]);
  const [error, setError] = useState("");

  // Get token from props or fallback to localStorage
  const token = propToken || localStorage.getItem("token");

  const fetchAirports = async () => {
    try {
      const res = await axios.get(`${API_URL}/airports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAirports(res.data);
    } catch (err) {
      console.error("❌ Error fetching airports:", err);
      setError("❌ Failed to load airports. Please try again.");
    }
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  return (
    <div className="airports-container animate__animated animate__fadeIn">
      <h2 className="animate__animated animate__fadeInDown">🛫 Airports</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {airports.map((airport) => (
          <li key={airport.airportId}>
            <strong>{airport.airportName}</strong> — {airport.airportCity}, {airport.airportCountry} ({airport.airportCode})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Airports;
