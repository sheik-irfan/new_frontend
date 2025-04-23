// components/AdminUsers.js

import React, { useEffect, useState } from "react";
import { fetchUsers } from "../services/AdminUsersService";
import { defaultUser } from "../models/UserModel";
import "../styles/AdminUsers.css"; // Optional: Make sure this file exists and is imported

const AdminUsers = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsersData = async () => {
    try {
      const res = await fetchUsers(token);
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = users.filter((user) =>
      Object.values(user)
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    if (token) {
      fetchUsersData();
    }
  }, [token]);

  return (
    <div className="admin-users-container">
      <h2>👥 Manage Users</h2>

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
          <li key={user.userId} className="user-card">
            <p><strong>👤 Name:</strong> {user.userName}</p>
            <p><strong>📧 Email:</strong> {user.userEmail}</p>
            <p><strong>⚧ Gender:</strong> {user.userGender}</p>
            <p>
              <strong>🛡️ Role:</strong>{" "}
              <span
                style={{
                  color: user.userRole === "ADMIN" ? "crimson" : "darkgreen",
                  fontWeight: "bold",
                }}
              >
                {user.userRole}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUsers;
