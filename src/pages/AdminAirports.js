import React, { useEffect, useState } from "react";
import { getAirports, addAirport, updateAirport, deleteAirport } from "../services/AdminAirportsService";
import { defaultAirport } from "../models/AdminAirportsModel";
import { Link } from "react-router-dom"; // Added to match AdminFlights import
import "../styles/AdminAirports.css"; // Styling

const AdminAirports = ({ token }) => {
  const [airports, setAirports] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newAirport, setNewAirport] = useState({ ...defaultAirport });
  const [editingCode, setEditingCode] = useState(null); // used for PUT updates
  const [sidebarOpen, setSidebarOpen] = useState(true); // Added the sidebarOpen state

  const fetchAirports = async () => {
    try {
      const res = await getAirports(token);
      setAirports(res.data);
      setFilteredAirports(res.data);
    } catch (err) {
      console.error("Failed to fetch airports", err);
    }
  };

  const handleAddOrUpdateAirport = async () => {
    try {
      if (editingCode) {
        await updateAirport(token, editingCode, newAirport);
        setEditingCode(null);
      } else {
        await addAirport(token, newAirport);
      }
      fetchAirports();
      setNewAirport({ ...defaultAirport });
    } catch (err) {
      alert("Failed to save airport");
    }
  };

  const handleDeleteAirport = async (code) => {
    try {
      await deleteAirport(token, code);
      fetchAirports();
    } catch (err) {
      alert("Failed to delete airport");
    }
  };

  const handleEditAirport = (airport) => {
    setNewAirport(airport);
    setEditingCode(airport.airportCode); // uses airportCode as unique identifier
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
  }, [token]);

  return (
    <div className="admin-airports-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? "❮" : "❯"}
        </div>
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/adminflights">Manage Flights</Link></li>
          <li><Link to="/adminairplanes">Manage Airplanes</Link></li>
          <li><Link to="/adminairports">Manage Airports</Link></li>
          <li><Link to="/adminusers">Manage Users</Link></li>
        </ul>
      </aside>
      
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
