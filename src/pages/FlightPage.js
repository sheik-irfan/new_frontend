import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/FlightPage.css";

const API_URL = "http://localhost:1212/api";

const Flights = ({ token }) => {
  const [flights, setFlights] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

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

  useEffect(() => {
    fetchFlights();
  }, []);

  const filteredFlights = flights.filter((flight) => {
    const term = searchTerm.toLowerCase();
    return (
      flight.flightNumber.toLowerCase().includes(term) ||
      flight.source.toLowerCase().includes(term) ||
      flight.destination.toLowerCase().includes(term)
    );
  });

  const sortFlights = (flights) => {
    const sorted = [...flights];
    switch (sortOption) {
      case "priceAsc":
        return sorted.sort((a, b) => a.price - b.price);
      case "priceDesc":
        return sorted.sort((a, b) => b.price - a.price);
      case "dateAsc":
        return sorted.sort((a, b) => new Date(a.departureDate) - new Date(b.departureDate));
      case "dateDesc":
        return sorted.sort((a, b) => new Date(b.departureDate) - new Date(a.departureDate));
      default:
        return sorted;
    }
  };

  const displayedFlights = sortFlights(filteredFlights);

  return (
    <div className="admin-flights-container">
      <h2>📋 All Flights </h2>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Search by number, source or destination"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort By</option>
          <option value="priceAsc">💸 Price: Low to High</option>
          <option value="priceDesc">💰 Price: High to Low</option>
          <option value="dateAsc">📆 Date: Soonest First</option>
          <option value="dateDesc">📅 Date: Latest First</option>
        </select>
      </div>

      {displayedFlights.length === 0 ? (
        <p className="no-flights">No flights found.</p>
      ) : (
        <ul className="flights-list">
          {displayedFlights.map((flight) => (
            <li key={flight.flightId} className="flight-card">
              <strong>✈️ {flight.flightNumber}</strong> — {flight.source} → {flight.destination}
              <br />
              🗓 {flight.departureDate} | 🕐 {flight.departureTime} → {flight.arrivalTime}
              <br />
              💺 Airplane ID: {flight.airplaneId} | 💰 ₹{flight.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Flights;
