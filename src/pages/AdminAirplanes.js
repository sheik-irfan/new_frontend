import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/AdminAirplanes.css";
import "animate.css";
import AdminSidebar from "../components/AdminSidebar";

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateInputs = (data) => {
    const newErrors = {};
    if (data.capacity < 0) {
      newErrors.capacity = "Capacity cannot be negative";
    }
    if (data.capacity === "") {
      newErrors.capacity = "Capacity is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAirplane = async () => {
    if (!validateInputs(newAirplane)) return;
    
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
    setErrors({});
  };

  const handleUpdateAirplane = async () => {
    if (!validateInputs(editAirplane)) return;
    
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
      const airplaneToDelete = airplanes.find(plane => plane.airplaneId === id);
      const isConfirmed = window.confirm(
        `Are you sure you want to delete airplane ${airplaneToDelete.airplaneName} (${airplaneToDelete.airplaneNumber})?\n\n` +
        `Model: ${airplaneToDelete.airplaneModel}\n` +
        `Manufacturer: ${airplaneToDelete.manufacturer}\n\n` +
        `This action cannot be undone.`
      );
      
      if (isConfirmed) {
        await axios.delete(`${API_URL}/airplanes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAirplanes();
        alert(`Airplane ${airplaneToDelete.airplaneName} (${airplaneToDelete.airplaneNumber}) deleted successfully!`);
      }
    } catch (err) {
      alert("Failed to delete airplane");
      console.error(err);
    }
  };

  const handleCapacityChange = (e, isEditing) => {
    const value = Math.max(0, parseInt(e.target.value) || 0); // Ensure value is not negative
    if (isEditing) {
      setEditAirplane({ ...editAirplane, capacity: value });
    } else {
      setNewAirplane({ ...newAirplane, capacity: value });
    }
  };

  return (
    <div className={`admin-dashboard ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}>
      <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <main className="admin-main">
        <h1 className="animate__animated animate__fadeInDown">Manage Airplanes</h1>

        <div className="admin-section">
          {/* Add or Edit Airplane Form */}
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
              min="0"
              value={isEditing ? editAirplane.capacity : newAirplane.capacity}
              onChange={(e) => handleCapacityChange(e, isEditing)}
            />
            {errors.capacity && <div className="error-message">{errors.capacity}</div>}
            
            {isEditing ? (
              <>
                <button onClick={handleUpdateAirplane}>Update</button>
                <button onClick={() => {
                  setIsEditing(false);
                  setEditAirplane(null);
                  setErrors({});
                }}>Cancel</button>
              </>
            ) : (
              <button onClick={handleAddAirplane}>Add Airplane</button>
            )}
          </div>

          {/* Airplanes List */}
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