// components/AirportAutocomplete.js

import React, { useState, useEffect } from "react";
import { fetchAirports } from "../services/AirportAutocompleteService.js";
import { defaultAirport } from "../models/AirportAutocomplete";
import "../styles/AirportAutocomplete.css"; // Optional: Make sure this file exists and is imported

const AirportAutocomplete = ({ label, onSelect }) => {
  const [query, setQuery] = useState("");
  const [airports, setAirports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAirportData = async () => {
      if (query.length < 3) {
        setAirports([]); // Clear the list if query is less than 3 characters
        return;
      }

      setIsLoading(true);
      const token = localStorage.getItem("token");
      const fetchedAirports = await fetchAirports(query, token);
      setAirports(fetchedAirports);
      setIsLoading(false);
    };

    fetchAirportData();
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
