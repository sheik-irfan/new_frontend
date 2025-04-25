import React, { useEffect, useState } from "react";
import { getAirports, addAirport, updateAirport, deleteAirport } from "../services/AdminAirportsService";
import { defaultAirport } from "../models/AdminAirportsModel";
import { Link } from "react-router-dom"; // Added to match AdminFlights import
import "../styles/AdminAirports.css"; // Styling
import AdminSidebar from "../components/AdminSidebar"; // Import AdminSidebar component

const AdminAirports = ({ token }) => {
  const [airports, setAirports] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newAirport, setNewAirport] = useState({ ...defaultAirport });
  const [editingCode, setEditingCode] = useState(null); // used for PUT updates
   const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // State for sidebar toggle

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
      // Add confirmation dialog
      const isConfirmed = window.confirm(`Are you sure you want to delete airport ${code}? This action cannot be undone.`);
      
      if (isConfirmed) {
        await deleteAirport(token, code);
        fetchAirports();
        alert(`Airport ${code} deleted successfully!`);
      }
    } catch (err) {
      alert("Failed to delete airport");
      console.error(err);
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
    <div className={`admin-dashboard ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}>
      {/* Sidebar */}
      <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
  
      {/* Main Content */}
      <main className="admin-main">
        <h2>Manage Airports</h2>
  
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search airports..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          style={{
            padding: "0.8rem",
            borderRadius: "0.7rem",
            border: "1px solid #90e0ef",
            width: "100%",
            marginBottom: "1.5rem",
            backgroundColor: "#f0f9ff"
          }}
        />
  
        {/* Add / Update Form */}
        <div className="add-flight-form">
          <input
            type="text"
            placeholder="Airport Code"
            value={newAirport.airportCode}
            onChange={(e) => setNewAirport({ ...newAirport, airportCode: e.target.value })}
          />
          <input
            type="text"
            placeholder="Airport Name"
            value={newAirport.airportName}
            onChange={(e) => setNewAirport({ ...newAirport, airportName: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            value={newAirport.airportCity}
            onChange={(e) => setNewAirport({ ...newAirport, airportCity: e.target.value })}
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
            onChange={(e) => setNewAirport({ ...newAirport, airportCountry: e.target.value })}
          />
          <button onClick={handleAddOrUpdateAirport}>
            {editingCode ? "✅ Update Airport" : "➕ Add Airport"}
          </button>
          {editingCode && (
            <button className="cancel-btn" onClick={() => {
              setNewAirport({ ...defaultAirport });
              setEditingCode(null);
            }}>
              ❌ Cancel
            </button>
          )}
        </div>
  
        {/* Airports List */}
        <div className="flights-list">
          {filteredAirports.map((airport) => (
            <div key={airport.airportCode} className="flight-card">
              <div className="flight-details">
                <h3>🛬 {airport.airportName}</h3>
                <p><strong>Code:</strong> {airport.airportCode}</p>
                <p><strong>City:</strong> {airport.airportCity}</p>
                <p><strong>Country:</strong> {airport.airportCountry}</p>
              </div>
              <div className="action-buttons">
                <button onClick={() => handleEditAirport(airport)}>✏️ Edit</button>
                <button onClick={() => handleDeleteAirport(airport.airportCode)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminAirports;
