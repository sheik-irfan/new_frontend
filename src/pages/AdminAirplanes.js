import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/AdminAirplanes.css";
import "animate.css";

const API_URL = "http://localhost:1212/api";

const AdminAirplanes = ({ token }) => {
  const [airplanes, setAirplanes] = useState([]);
  const [newAirplane, setNewAirplane] = useState({
    airplaneName: "",
    airplaneNumber: "",
    airplaneModel: "",
    manufacturer: "",
    capacity: "",
  });
  const [editAirplane, setEditAirplane] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchAirplanes = async () => {
    try {
      const res = await axios.get(`${API_URL}/airplanes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAirplanes(res.data);
    } catch (err) {
      console.error("Failed to fetch airplanes", err);
    }
  };

  useEffect(() => {
    fetchAirplanes();
  }, []);

  const handleAddAirplane = async () => {
    try {
      await axios.post(`${API_URL}/airplanes`, newAirplane, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewAirplane({
        airplaneName: "",
        airplaneNumber: "",
        airplaneModel: "",
        manufacturer: "",
        capacity: "",
      });
      fetchAirplanes();
    } catch (err) {
      alert("Failed to add airplane");
    }
  };

  const handleEditClick = (airplane) => {
    setEditAirplane(airplane);
    setIsEditing(true);
  };

  const handleUpdateAirplane = async () => {
    try {
      await axios.put(`${API_URL}/airplanes/${editAirplane.airplaneId}`, editAirplane, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditAirplane(null);
      setIsEditing(false);
      fetchAirplanes();
    } catch (err) {
      alert("Failed to update airplane");
    }
  };

  const handleDeleteAirplane = async (id) => {
    try {
      await axios.delete(`${API_URL}/airplanes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAirplanes();
    } catch (err) {
      alert("Failed to delete airplane");
    }
  };

  return (
    <div className={`admin-dashboard ${sidebarOpen ? "sidebar-open" : ""}`}>
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
        <h1 className="animate__animated animate__fadeInDown">Manage Airplanes</h1>

        <div className="admin-section">
          <div className="add-airplane-form">
            <input
              type="text"
              placeholder="Airplane Name"
              value={isEditing ? editAirplane.airplaneName : newAirplane.airplaneName}
              onChange={(e) =>
                isEditing
                  ? setEditAirplane({ ...editAirplane, airplaneName: e.target.value })
                  : setNewAirplane({ ...newAirplane, airplaneName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Airplane Number"
              value={isEditing ? editAirplane.airplaneNumber : newAirplane.airplaneNumber}
              onChange={(e) =>
                isEditing
                  ? setEditAirplane({ ...editAirplane, airplaneNumber: e.target.value })
                  : setNewAirplane({ ...newAirplane, airplaneNumber: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Airplane Model"
              value={isEditing ? editAirplane.airplaneModel : newAirplane.airplaneModel}
              onChange={(e) =>
                isEditing
                  ? setEditAirplane({ ...editAirplane, airplaneModel: e.target.value })
                  : setNewAirplane({ ...newAirplane, airplaneModel: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Manufacturer"
              value={isEditing ? editAirplane.manufacturer : newAirplane.manufacturer}
              onChange={(e) =>
                isEditing
                  ? setEditAirplane({ ...editAirplane, manufacturer: e.target.value })
                  : setNewAirplane({ ...newAirplane, manufacturer: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Capacity"
              value={isEditing ? editAirplane.capacity : newAirplane.capacity}
              onChange={(e) =>
                isEditing
                  ? setEditAirplane({ ...editAirplane, capacity: e.target.value })
                  : setNewAirplane({ ...newAirplane, capacity: e.target.value })
              }
            />
            {isEditing ? (
              <button onClick={handleUpdateAirplane}>Update</button>
            ) : (
              <button onClick={handleAddAirplane}>Add Airplane</button>
            )}
          </div>

          <ul className="airplanes-list">
            {airplanes.map((plane) => (
              <li key={plane.airplaneId}>
                🛩 {plane.airplaneName} ({plane.airplaneNumber}) - {plane.airplaneModel}, {plane.manufacturer} — Capacity: {plane.capacity}
                <button onClick={() => handleEditClick(plane)}>✏️ Edit</button>
                <button onClick={() => handleDeleteAirplane(plane.airplaneId)}>🗑 Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminAirplanes;
