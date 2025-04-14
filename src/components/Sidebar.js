// src/components/Sidebar.js
import React from "react";
import "./Sidebar.css";

const Sidebar = ({ onLogout }) => {
  return (
    <div className="sidebar">
      <h3>Navigation</h3>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Sidebar;
