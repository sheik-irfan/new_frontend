// src/pages/FlightPage.js
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/FlightPage.css";

const API_URL = "http://localhost:1212/api";

const FlightPage = () => {
  const location = useLocation();
  const searchParams = location.state || {};
  const [flights, setFlights] = useState([]);
  const [allFlights, setAllFlights] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.get(`${API_URL}/flights`);
        setAllFlights(res.data);
      } catch (error) {
        console.error("Failed to fetch flights", error);
      }
    };

    fetchFlights();
  }, []);

  useEffect(() => {
    if (
      searchParams.source ||
      searchParams.destination ||
      searchParams.date
    ) {
      const filtered = allFlights.filter((flight) => {
        const matchesSource = searchParams.source
          ? flight.source.toLowerCase().includes(searchParams.source.toLowerCase())
          : true;
        const matchesDestination = searchParams.destination
          ? flight.destination.toLowerCase().includes(searchParams.destination.toLowerCase())
          : true;
        const matchesDate = searchParams.date
          ? flight.departureDate.includes(searchParams.date)
          : true;
        return matchesSource && matchesDestination && matchesDate;
      });
      setFlights(filtered);
    } else {
      setFlights(allFlights); // Show all by default
    }
  }, [searchParams, allFlights]);

  return (
    <div className="flight-page-container">
      <h2>Available Flights</h2>
      <div className="flights-list fade-in">
        {flights.length > 0 ? (
          flights.map((flight) => (
            <div key={flight.flightId} className="flight-card">
              <p><strong>Flight:</strong> {flight.flightNumber}</p>
              <p><strong>From:</strong> {flight.source}</p>
              <p><strong>To:</strong> {flight.destination}</p>
              <p><strong>Date:</strong> {flight.departureDate}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No flights found.</p>
        )}
      </div>
    </div>
  );
};

export default FlightPage;
