import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import Sidebar from "../components/Sidebar"; // Adjust path as needed
import "../styles/FlightPage.css";
import "../components/Sidebar.css"; // Ensure sidebar styles are available
 
const API_URL = "http://localhost:1212/api/flights";
 
const FlightPage = ({ token, onLogout }) => {
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Used to access state passed from HomePage
  const searchCriteria = location.state?.searchCriteria || {}; // Default to empty object if state is null
 
  useEffect(() => {
    fetchFlights();
  }, []);
 
  const fetchFlights = async () => {
    try {
      // Fetching flights based on search criteria
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: searchCriteria, // Passing search criteria as query params
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
 
  const getFlightDuration = (departure, arrival) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr - dep;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };
 
  return (
<div className="dashboard-container">
<Sidebar collapsed={collapsed} setCollapsed={setCollapsed} onLogout={onLogout} />
<div className="dashboard-main">
<h2>✈️ Flights Matching Your Search</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
<div className="flight-list">
          {flights.map((flight) => (
<div key={flight.id} className="flight-card">
<div className="flight-meta">
<span className="airline-info">{flight.airline}</span>
</div>
<div className="flight-times">
<div className="flight-block">
<strong>{flight.fromAirportName || flight.departureAirportName}</strong>
<div>{new Date(flight.departureTime).toLocaleString()}</div>
</div>
<div className="flight-middle">
<div className="flight-path">
<div className="line"></div>
<div className="plane-icon">✈</div>
<div className="line"></div>
</div>
<div className="duration">{getFlightDuration(flight.departureTime, flight.arrivalTime)}</div>
</div>
<div className="flight-block">
<strong>{flight.toAirportName || flight.arrivalAirportName}</strong>
<div>{new Date(flight.arrivalTime).toLocaleString()}</div>
</div>
</div>
<div className="flight-bottom">
<div className="price-block">
<div className="label">Price</div>
<div className="price">₹{flight.price.toLocaleString("en-IN")}</div>
</div>
<button className="book-button" onClick={() => handleBookClick(flight.id)}>
                  Book
</button>
</div>
</div>
          ))}
</div>
</div>
</div>
  );
};
 
export default FlightPage;