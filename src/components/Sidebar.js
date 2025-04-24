// src/components/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css"; // Ensure styles are consistent with admin style

const Sidebar = ({ collapsed, setCollapsed, onLogout }) => {
  const location = useLocation();

  return (
    <aside className={`admin-sidebar animate__animated animate__fadeInLeft ${collapsed ? "closed" : "open"}`}>
      {/* Collapse Toggle */}
      <div className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "❯" : "❮"}
      </div>

      {/* Sidebar Header */}
      {!collapsed && <div className="sidebar-title">Customer Panel</div>}

      {/* Navigation Links */}
      <ul className="sidebar-nav">
        <li>
          <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
            {collapsed ? "" : "Dashboard"}
          </Link>
        </li>
        <li>
          <Link to="/flights" className={location.pathname === "/flights" ? "active" : ""}>
            {collapsed ? "" : "View Flights"}
          </Link>
        </li>
        {/* <li>
          <Link to="/airports" className={location.pathname === "/airports" ? "active" : ""}>
            {collapsed ? "" : "View Airports"}
          </Link>
        </li>
        <li>
          <Link to="/airplanes" className={location.pathname === "/airplanes" ? "active" : ""}>
            {collapsed ? "" : "View Airplanes"}
          </Link>
        </li> */}
        <li>
          <Link to="/wallet" className={location.pathname === "/wallet" ? "active" : ""}>
            {collapsed ? "" : "Wallet"}
          </Link>
        </li>
        <li>
          <Link to="/bookings" className={location.pathname === "/bookings" ? "active" : ""}>
            {collapsed ? "" : "Bookings"}
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
