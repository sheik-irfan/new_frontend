// src/components/Sidebar.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css"; // Optional: Add your sidebar styles here

const Sidebar = ({ collapsed, setCollapsed, onLogout }) => {
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>{!collapsed ? "Dashboard" : "🧭"}</h2>
        <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "➡️" : "⬅️"}
        </button>
      </div>
      <nav>
        <ul>
          <li onClick={() => setCollapsed(true)}>
            <Link to="/flights">{collapsed ? "✈️" : "✈️ View Flights"}</Link>
          </li>
          <li onClick={() => setCollapsed(true)}>
            <Link to="/airports">{collapsed ? "🛫" : "🛫 Airports"}</Link>
          </li>
          <li onClick={() => setCollapsed(true)}>
            <Link to="/airplanes">{collapsed ? "🛬" : "🛬 Airplanes"}</Link>
          </li>
          <li onClick={() => setCollapsed(true)}>
            <Link to="/wallet">{collapsed ? "💰" : "💰 Wallet"}</Link>
          </li>
          <li onClick={() => setCollapsed(true)}>
            <Link to="/bookings">{collapsed ? "📄" : "📄 Bookings"}</Link>
          </li>
          <li>
            <button className="logout-btn" onClick={onLogout}>
              {collapsed ? "🚪" : "🚪 Logout"}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
