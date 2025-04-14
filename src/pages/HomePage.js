// src/pages/HomePage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    source: "",
    destination: "",
    date: "",
    tripType: "",
  });

  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    // In real app: pass search params to flight search route or API
    alert(`Searching: ${JSON.stringify(search, null, 2)}`);
    navigate("/flights");
  };

  return (
    <div className="home-container">
      <h1 className="home-heading">Find Your Next Adventure</h1>
      <p className="home-subheading">Book flights easily with our smart platform</p>

      <div className="search-box">
        <input
          type="text"
          name="source"
          placeholder="From (Source)"
          value={search.source}
          onChange={handleChange}
        />
        <input
          type="text"
          name="destination"
          placeholder="To (Destination)"
          value={search.destination}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={search.date}
          onChange={handleChange}
        />
        <select name="tripType" value={search.tripType} onChange={handleChange}>
          <option value="">Trip Type (Optional)</option>
          <option value="one-way">One Way</option>
          <option value="round-trip">Round Trip</option>
        </select>
        <button className="animated-button" onClick={handleSearch}>
          Search Flights
        </button>
      </div>
    </div>
  );
};

export default HomePage;
