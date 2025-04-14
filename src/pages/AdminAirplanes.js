import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminAirplanes.css";
 
const API_URL = "http://localhost:1212/api";
 
const AdminAirplanes = ({ token }) => {
  const [airplanes, setAirplanes] = useState([]);
  const [newAirplane, setNewAirplane] = useState({
    name: "",
    model: "",
    manufacturer: "",
    capacity: ""
  });
  const [editAirplane, setEditAirplane] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
 
  const fetchAirplanes = async () => {
    try {
      const res = await axios.get(`${API_URL}/airplanes`, {
        headers: { Authorization: `Bearer ${token}` }
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
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewAirplane({ name: "", model: "", manufacturer: "", capacity: "" });
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
      await axios.put(`${API_URL}/airplanes/${editAirplane.id}`, editAirplane, {
        headers: { Authorization: `Bearer ${token}` }
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
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAirplanes();
    } catch (err) {
      alert("Failed to delete airplane");
    }
  };
 
  return (
    <div className="admin-airplanes-container">
      <h2>Manage Airplanes</h2>
 
      <div className="add-airplane-form">
        <input
          type="text"
          placeholder="Name"
          value={isEditing ? editAirplane.name : newAirplane.name}
          onChange={(e) =>
            isEditing
              ? setEditAirplane({ ...editAirplane, name: e.target.value })
              : setNewAirplane({ ...newAirplane, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Model"
          value={isEditing ? editAirplane.model : newAirplane.model}
          onChange={(e) =>
            isEditing
              ? setEditAirplane({ ...editAirplane, model: e.target.value })
              : setNewAirplane({ ...newAirplane, model: e.target.value })
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
          <li key={plane.id}>
            🛩 {plane.name} - {plane.model} ({plane.manufacturer}) - Capacity: {plane.capacity}
            <button onClick={() => handleEditClick(plane)}>✏️ Edit</button>
            <button onClick={() => handleDeleteAirplane(plane.id)}>🗑 Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
 
export default AdminAirplanes;