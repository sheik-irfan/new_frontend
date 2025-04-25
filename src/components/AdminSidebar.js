import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminSidebar.css"; // Ensure styles are consistent with admin panel

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  return (
    <aside className={`admin-sidebar ${collapsed ? "closed" : "open"}`}>
      {/* Collapse Toggle */}
      <div className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "❯" : "❮"}
      </div>

      {/* Sidebar Header */}
      {!collapsed && <div className="sidebar-title">Admin Panel</div>}

      {/* Navigation Links */}
      <ul className="sidebar-nav">
        <li>
          <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
            {collapsed ? "" : "Dashboard"}
          </Link>
        </li>
        <li>
          <Link to="/adminflights" className={location.pathname === "/adminflights" ? "active" : ""}>
            {collapsed ? "" : "Manage Flights"}
          </Link>
        </li>
        <li>
          <Link to="/adminairplanes" className={location.pathname === "/adminairplanes" ? "active" : ""}>
            {collapsed ? "" : "Manage Airplanes"}
          </Link>
        </li>
        <li>
          <Link to="/adminairports" className={location.pathname === "/adminairports" ? "active" : ""}>
            {collapsed ? "" : "Manage Airports"}
          </Link>
        </li>
        <li>
          <Link to="/adminusers" className={location.pathname === "/adminusers" ? "active" : ""}>
            {collapsed ? "" : "Manage Users"}
          </Link>
        </li>
        {/* <li>
          <Link to="/bookings" className={location.pathname === "/bookings" ? "active" : ""}>
            {collapsed ? "" : "View Bookings"}
          </Link>
        </li> */}
      </ul>
    </aside>
  );
};

export default AdminSidebar;
