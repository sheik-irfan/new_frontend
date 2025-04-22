import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
 
const FlightSearchPage = () => {
  const location = useLocation();
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 
  const query = new URLSearchParams(location.search);
  const sourceId = query.get("sourceId");
  const destinationId = query.get("destinationId");
  const date = query.get("date");
 
  useEffect(() => {
    const fetchFlights = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
 
      try {
        const response = await axios.get(`http://localhost:1212/api/flights/search`, {
          params: { sourceId, destinationId, date }, // Can all be undefined
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFlights(response.data);
      } catch (err) {
        console.error("Failed to fetch flights", err);
        setError(err.response?.data?.message || "Could not load flights.");
      } finally {
        setIsLoading(false);
      }
    };
 
    fetchFlights();
  }, [sourceId, destinationId, date]);  
 
  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛫 Matching Flights</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isLoading ? (
        <p>Loading flights...</p>
      ) : flights.length === 0 && !error ? (
        <p>No flights found for the selected criteria.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th style={cellStyle}>Airline</th>
              <th style={cellStyle}>From</th>
              <th style={cellStyle}>To</th>
              <th style={cellStyle}>Departure</th>
              <th style={cellStyle}>Arrival</th>
              <th style={cellStyle}>Price</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.id}>
                <td style={cellStyle}>{flight.airline}</td>
                <td style={cellStyle}>{flight.fromAirportName}</td>
                <td style={cellStyle}>{flight.toAirportName}</td>
                <td style={cellStyle}>{new Date(flight.departureTime).toLocaleString()}</td>
                <td style={cellStyle}>{new Date(flight.arrivalTime).toLocaleString()}</td>
                <td style={cellStyle}>₹{Number(flight.price).toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
 
const cellStyle = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "center",
};
 
export default FlightSearchPage;