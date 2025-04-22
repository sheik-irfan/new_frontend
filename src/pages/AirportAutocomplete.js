import React, { useState, useEffect } from "react";
import axios from "axios";
 
const API_URL = "http://localhost:1212/api";
 
const AirportAutocomplete = ({ label, onSelect }) => {
  const [query, setQuery] = useState("");
  const [airports, setAirports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 
  useEffect(() => {
    const fetchAirports = async () => {
      if (query.length < 3) {
        setAirports([]);
        return;
      }
 
      setIsLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${API_URL}/airports/search?query=${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAirports(res.data);
      } catch (err) {
        console.error("Failed to fetch airports", err);
        setAirports([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAirports();
  }, [query]);
 
  return (
    <div className="autocomplete-wrapper">
      <label>{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${label} Airport`}
      />
      {isLoading && <p>Loading airports...</p>}
      {airports.length > 0 && (
        <ul className="dropdown">
          {airports.map((airport) => (
            <li
              key={airport.airportId}
              onClick={() => {
                setQuery(airport.airportName); // Update the query to show the selected airport's name
                onSelect(airport); // Pass the selected airport to the parent
                setAirports([]); // Close the dropdown
              }}
            >
              {airport.airportName} ({airport.airportCode}) - {airport.airportCity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
 
export default AirportAutocomplete;