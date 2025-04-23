import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminAirplanes.css";

const API_URL = "http://localhost:1212/api";

const AdminAirplanes = ({ token }) => {
  const [airplanes, setAirplanes] = useState([]);
  const [newAirplane, setNewAirplane] = useState({
    airplaneNumber: "",
    airplaneName: "",
    airplaneModel: "",
    manufacturer: "",
    capacity: "",
  });
  const [editAirplane, setEditAirplane] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
        airplaneNumber: "",
        airplaneName: "",
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
      // Updated URL for PUT request: Using 'number' in the endpoint
      await axios.put(`${API_URL}/airplanes/number/${editAirplane.airplaneNumber}`, editAirplane, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditAirplane(null);
      setIsEditing(false);
      fetchAirplanes();
    } catch (err) {
      alert("Failed to update airplane");
      console.error(err);
    }
  };

  const handleDeleteAirplane = async (airplaneNumber) => {
    try {
      await axios.delete(`${API_URL}/airplanes/number/${airplaneNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAirplanes();
    } catch (err) {
      alert("Failed to delete airplane");
    }
  };

  return (
    <div className="admin-airplanes-container">
      <h2>Manage Airplanes</h2>

      <div className="form-container">
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
        <button onClick={isEditing ? handleUpdateAirplane : handleAddAirplane}>
          {isEditing ? "Update" : "Add Airplane"}
        </button>
      </div>

      <ul className="airplanes-list">
        {airplanes.map((plane) => (
          <li key={plane.airplaneNumber}>
            <div className="plane-info">
              <strong>{plane.airplaneName}</strong> - {plane.airplaneModel} (
              {plane.manufacturer}) - Capacity: {plane.capacity}
            </div>
            <div className="plane-actions">
              <button onClick={() => handleEditClick(plane)}>Edit</button>
              <button onClick={() => handleDeleteAirplane(plane.airplaneNumber)}>
                Delete
              </button>
            </div>
          </li>
        ))}
        {airplanes.length === 0 && (
          <li className="no-airplanes">No airplanes found.</li>
        )}
      </ul>
    </div>
  );
};

export default AdminAirplanes;

