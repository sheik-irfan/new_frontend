import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/AdminUsers.css";
import "animate.css";

const API_URL = "http://localhost:1212/api";

const AdminUsers = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true); // ← For toggling sidebar

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = users.filter((user) =>
      Object.values(user).join(" ").toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
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
        <h1 className="animate__animated animate__fadeInDown">Manage Users</h1>

        <div className="admin-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <ul className="users-list">
            {filteredUsers.map((user) => (
              <li key={user.userId}>
                👤 <strong>{user.userName}</strong><br />
                📧 {user.userEmail} | ⚧ {user.userGender} | 🛡️ {user.userRole}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
