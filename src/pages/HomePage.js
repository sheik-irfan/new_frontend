import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AirportAutocomplete from "../pages/AirportAutocomplete";
import "../styles/HomePage.css";
 
const API_URL = "http://localhost:1212/api";
 
const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    source: null,
    destination: null,
    date: "",
    tripType: "",
  });
  const [allFlights, setAllFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
 
  const backgrounds = ["bg1", "bg2", "bg3", "bg4", "bg5"];
  const quotes = [
    { text: "The world is a book, and those who do not travel read only a page", author: "Saint Augustine" },
    { text: "Travel makes one modest. You see what a tiny place you occupy in the world", author: "Gustave Flaubert" },
    { text: "Life is either a daring adventure or nothing at all", author: "Helen Keller" },
    { text: "We travel not to escape life, but for life not to escape us", author: "Anonymous" },
    { text: "Adventure is worthwhile", author: "Aesop" },
  ];
 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
 
  useEffect(() => {
    fetchAllFlights();
    checkLoginStatus(); // Check if user is logged in
  }, []);
 
  const fetchAllFlights = async () => {
    try {
      const res = await fetch(`${API_URL}/flights`);
      const text = await res.text();
 
      if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) {
        throw new Error("Unexpected response: not JSON");
      }
 
      const data = JSON.parse(text);
      setAllFlights(data);
    } catch (err) {
      console.error("Error loading all flights:", err);
    }
  };
 
  const checkLoginStatus = () => {
    // Check if a valid token exists in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set logged-in state based on token presence
  };
 
  const handleAirportSelect = (value, type) => {
    setSearch({ ...search, [type]: value });
  };
 
  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };
 
  const fetchAirports = async (query) => {
    try {
      const response = await fetch(`${API_URL}/airports/search?query=${query}`);
      const data = await response.json();
      setAirports(data);
    } catch (error) {
      console.error("Error fetching airports:", error.message);
    }
  };
 
  const handleSearch = () => {
    const { source, destination, date } = search;
 
    const filtered = allFlights.filter((flight) => {
      const matchSource = source ? flight.sourceId === source.id : true;
      const matchDestination = destination ? flight.destinationId === destination.id : true;
      const matchDate = date ? flight.departureTime.startsWith(date) : true;
      return matchSource && matchDestination && matchDate;
    });
 
    if (isLoggedIn) {
      // If the user is logged in, navigate to /flights with search criteria
      navigate("/flights", {
        state: {
          searchResults: filtered,
          searchCriteria: search,
        },
      });
    } else {
      // If not logged in, navigate to /login and pass along search criteria
      navigate("/login", {
        state: {
          searchCriteria: search,
        },
      });
    }
  };
 
  return (
    <div className="home-page">
<div className={`hero-section ${backgrounds[currentIndex]}`}>
<div className="hero-overlay"></div>
<div className="hero-content">
<div className="hero-text-left">
<h1>Elevate Your</h1>
<div className="hero-tagline">
<span>PREMIUM</span>
<span>EFFICIENT</span>
</div>
</div>
<div className="hero-text-right">
<h1>Travel Experience</h1>
<div className="hero-tagline">
<span>RELIABLE</span>
<span>SERVICE</span>
</div>
</div>
</div>
<p className="hero-subtitle">Premium flight bookings with effortless convenience</p>
 
        <div className="search-form-container">
<div className="search-box">
<div className="input-group">
<AirportAutocomplete
                label="From"
                onSelect={(val) => handleAirportSelect(val, "source")}
                onSearch={fetchAirports}
                airports={airports}
              />
</div>
<div className="input-group">
<AirportAutocomplete
                label="To"
                onSelect={(val) => handleAirportSelect(val, "destination")}
                onSearch={fetchAirports}
                airports={airports}
              />
</div>
<div className="input-group">
<input
                type="date"
                name="date"
                value={search.date}
                onChange={handleChange}
              />
</div>
<div className="input-group">
<select name="tripType" value={search.tripType} onChange={handleChange}>
<option value="">Trip Type</option>
<option value="one-way">One Way</option>
<option value="round-trip">Round Trip</option>
</select>
</div>
<button onClick={handleSearch}>
              Search Flights <span className="button-icon">🔍</span>
</button>
</div>
</div>
 
        <div className="scroll-indicator">
<span>↓ Explore destinations ↓</span>
</div>
</div>
 
      <div className="content-section">
<div className="quote-container">
<p className="travel-quote">"{quotes[currentIndex].text}"</p>
<p className="quote-author">- {quotes[currentIndex].author}</p>
</div>
 
        <div className="features-section">
<div className="feature-card">
<div className="feature-icon">✈️</div>
<h3>Global Coverage</h3>
<p>Access to over 500 destinations worldwide with our extensive airline network</p>
</div>
<div className="feature-card">
<div className="feature-icon">⭐</div>
<h3>Premium Service</h3>
<p>Enjoy luxury travel with our first-class customer experience</p>
</div>
<div className="feature-card">
<div className="feature-icon">🔄</div>
<h3>Flexible Options</h3>
<p>Easy changes and cancellations with transparent policies</p>
</div>
</div>
 
        <div className="airline-partners">
<h2>Our Trusted Airline Partners</h2>
<div className="airline-logos">
<img src="https://logo.clearbit.com/delta.com" alt="Delta" />
<img src="https://logo.clearbit.com/united.com" alt="United" />
<img src="https://logo.clearbit.com/aa.com" alt="American Airlines" />
<img src="https://logo.clearbit.com/emirates.com" alt="Emirates" />
<img src="https://logo.clearbit.com/lufthansa.com" alt="Lufthansa" />
</div>
</div>
 
        {allFlights.length > 0 && (
<div className="flights-list-section">
<h2>✈️ All Available Flights</h2>
<table className="flights-table">
<thead>
<tr>
<th>Airline</th>
<th>From</th>
<th>To</th>
<th>Departure</th>
<th>Arrival</th>
<th>Price</th>
</tr>
</thead>
<tbody>
                {allFlights.map((flight) => (
<tr key={flight.id}>
<td>{flight.airline}</td>
<td>{flight.fromAirportName || flight.departureAirportName}</td>
<td>{flight.toAirportName || flight.arrivalAirportName}</td>
<td>{new Date(flight.departureTime).toLocaleString()}</td>
<td>{new Date(flight.arrivalTime).toLocaleString()}</td>
<td>₹{flight.price.toLocaleString("en-IN")}</td>
</tr>
                ))}
</tbody>
</table>
</div>
        )}
</div>
</div>
  );
};
 
export default HomePage;