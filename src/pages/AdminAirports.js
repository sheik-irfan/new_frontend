import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/AdminAirport.css";
import "animate.css";

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
  const [editingId, setEditingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true); // ← For toggling sidebar

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
      if (editingId) {
        await axios.put(`${API_URL}/airports/${editingId}`, newAirport, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingId(null);
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

  const handleDeleteAirport = async (id) => {
    try {
      await axios.delete(`${API_URL}/airports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAirports();
    } catch (err) {
      alert("Failed to delete airport");
    }
  };

  const handleEditAirport = (airport) => {
    setNewAirport(airport);
    setEditingId(airport.airportId);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = airports.filter((airport) =>
      Object.values(airport).join(" ").toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAirports(filtered);
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  return (
    <div className={`admin-dashboard ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* Sidebar with toggle arrow */}
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
          <li><Link to="/bookings">Bookings</Link></li>
        </ul>
      </aside>

      <main className="admin-main">
        <h1 className="animate__animated animate__fadeInDown">Manage Airports</h1>

        <div className="admin-section">
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
              {editingId ? "Update Airport" : "Add Airport"}
            </button>
          </div>
        </div>

        <div className="admin-section">
          <h3>Airport List</h3>
          <ul className="airports-list">
            {filteredAirports.map((airport) => (
              <li key={airport.airportId}>
                🛫 {airport.airportName} ({airport.airportCode}) -{" "}
                {airport.airportCity}, {airport.airportState},{" "}
                {airport.airportCountry}
                <button onClick={() => handleEditAirport(airport)}>✏️ Edit</button>
                <button onClick={() => handleDeleteAirport(airport.airportId)}>🗑 Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminAirports;
