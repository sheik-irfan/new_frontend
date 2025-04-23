import React, { useEffect, useState } from "react";
import { fetchAirplanes } from "../services/AdminAirplaneService.js";

const Airplanes = ({ token }) => {
  const [airplanes, setAirplanes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAirplanes = async () => {
      try {
        const data = await fetchAirplanes(token);
        setAirplanes(data);
      } catch (err) {
        console.error("Failed to load airplanes:", err);
        setError("❌ Failed to load airplanes. Please try again.");
      }
    };

    loadAirplanes();
  }, [token]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛬 Airplanes</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {airplanes.length === 0 && !error && <p>Loading airplanes...</p>}

      <ul>
        {airplanes.map((airplane) => (
          <li key={airplane.airplaneId}>
            <strong>{airplane.airplaneName}</strong> ({airplane.airplaneModel}) —{" "}
            {airplane.manufacturer}, Capacity: {airplane.capacity}, Airplane ID: {airplane.airplaneId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Airplanes;
