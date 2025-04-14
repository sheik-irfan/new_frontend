import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:1212/api";

const Airplanes = ({ token }) => {
  const [airplanes, setAirplanes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAirplanes = async () => {
      try {
        const res = await axios.get(`${API_URL}/airplanes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAirplanes(res.data);
      } catch (err) {
        console.error("Failed to fetch airplanes", err);
        setError("❌ Failed to load airplanes. Please try again.");
      }
    };

    fetchAirplanes();
  }, [token]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛬 Airplanes</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {airplanes.map((airplane) => (
          <li key={airplane.id}>
            <strong>{airplane.name}</strong> ({airplane.model}) — {airplane.manufacturer}, Capacity: {airplane.capacity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Airplanes;
