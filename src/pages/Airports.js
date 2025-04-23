import React, { useEffect, useState } from "react";
import "animate.css";
import { fetchAllAirports } from "../services/AirportsService";
import { formatAirport } from "../models/AirportsModel";
 
const Airports = ({ token: propToken }) => {
  const [airports, setAirports] = useState([]);
  const [error, setError] = useState("");
 
  const token = propToken || localStorage.getItem("token");
 
  useEffect(() => {
    const loadAirports = async () => {
      try {
        const data = await fetchAllAirports(token);
        setAirports(data);
      } catch (err) {
        console.error("❌ Error fetching airports:", err);
        setError("❌ Failed to load airports. Please try again.");
      }
    };
    loadAirports();
  }, [token]);
 
  return (
    <div className="airports-container animate__animated animate__fadeIn">
      <h2 className="animate__animated animate__fadeInDown">🛫 Airports</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {airports.map((airport) => (
          <li key={airport.airportId}>{formatAirport(airport)}</li>
        ))}
      </ul>
    </div>
  );
};
 
export default Airports;