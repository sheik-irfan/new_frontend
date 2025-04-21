// src/components/FlightSearchForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AirportAutocomplete from './AirportAutocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const FlightSearchForm = () => {
  const [sourceAirport, setSourceAirport] = useState(null);
  const [destinationAirport, setDestinationAirport] = useState(null);
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const query = new URLSearchParams({
        sourceId: sourceAirport?.id || '',
        destinationId: destinationAirport?.id || '',
        date,
      });

      const res = await fetch(`/api/flights/search?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const text = await res.text();
      if (!text.trim().startsWith("{")) throw new Error("Invalid response");
      const flights = JSON.parse(text);

      navigate("/flights", {
        state: {
          searchResults: flights,
          searchCriteria: {
            sourceAirport,
            destinationAirport,
            date,
          },
        },
      });
    } catch (err) {
      console.error("Search error:", err);
      alert("Failed to search flights. Try again.");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: "2rem" }}>
      <h2>Search for Flights</h2>

      <AirportAutocomplete label="Source Airport" onSelect={setSourceAirport} />
      <AirportAutocomplete label="Destination Airport" onSelect={setDestinationAirport} />

      <TextField
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        label="Travel Date"
        fullWidth
        sx={{ marginBottom: "1rem" }}
        InputLabelProps={{ shrink: true }}
      />

      <Button
        variant="contained"
        onClick={handleSearch}
        disabled={!sourceAirport || !destinationAirport || !date}
        fullWidth
      >
        🔍 Search Flights
      </Button>
    </Box>
  );
};

export default FlightSearchForm;