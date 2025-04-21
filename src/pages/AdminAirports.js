import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminAirports.css"; // Assuming you have a CSS file for styling

const API_URL = "http://localhost:1212/api";

const AdminAirports = ({ token }) => {
  const [airports, setAirports] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newAirport, setNewAirport] = useState({
    airportName: "",
    airportCode: "",
    airportCity: "",
    airportState: "",
    airportCountry: "",
  });
  const [editingCode, setEditingCode] = useState(null); // Store airport code for editing

  const fetchAirports = async () => {
    try {
      const res = await axios.get(`${API_URL}/airports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAirports(res.data);
      setFilteredAirports(res.data);
    } catch (err) {
      console.error("Failed to fetch airports", err);
    }
  };

  const handleAddOrUpdateAirport = async () => {
    try {
      if (editingCode) {
        // Use airportCode (e.g., LAX) in the PUT request URL
        await axios.put(`${API_URL}/airports/${editingCode}`, newAirport, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingCode(null); // Reset editing code after update
      } else {
        await axios.post(`${API_URL}/airports`, newAirport, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchAirports();
      setNewAirport({
        airportName: "",
        airportCode: "",
        airportCity: "",
        airportState: "",
        airportCountry: "",
      });
    } catch (err) {
      alert("Failed to save airport");
    }
  };

  const handleDeleteAirport = async (code) => {
    try {
      await axios.delete(`${API_URL}/airports/${code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAirports();
    } catch (err) {
      alert("Failed to delete airport");
    }
  };

  const handleEditAirport = (airport) => {
    setNewAirport(airport);
    setEditingCode(airport.airportCode); // Set airportCode for editing
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = airports.filter((airport) =>
      Object.values(airport)
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setFilteredAirports(filtered);
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  return (
    <div className="admin-airports-container">
      <h2>Manage Airports</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search airports..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="add-airport-form">
        <input
          type="text"
          placeholder="Airport Name"
          value={newAirport.airportName}
          onChange={(e) =>
            setNewAirport({ ...newAirport, airportName: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Code"
          value={newAirport.airportCode}
          onChange={(e) =>
            setNewAirport({ ...newAirport, airportCode: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="City"
          value={newAirport.airportCity}
          onChange={(e) =>
            setNewAirport({ ...newAirport, airportCity: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="State"
          value={newAirport.airportState}
          onChange={(e) =>
            setNewAirport({ ...newAirport, airportState: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Country"
          value={newAirport.airportCountry}
          onChange={(e) =>
            setNewAirport({ ...newAirport, airportCountry: e.target.value })
          }
        />
        <button onClick={handleAddOrUpdateAirport}>
          {editingCode ? "Update Airport" : "Add Airport"}
        </button>
      </div>

      <ul className="airports-list">
        {filteredAirports.map((airport) => (
          <li key={airport.airportCode}>
            🛫 {airport.airportName} ({airport.airportCode}) - {airport.airportCity},{" "}
            {airport.airportState}, {airport.airportCountry}
            <button onClick={() => handleEditAirport(airport)}>✏️ Edit</button>
            <button onClick={() => handleDeleteAirport(airport.airportCode)}>🗑 Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminAirports;
