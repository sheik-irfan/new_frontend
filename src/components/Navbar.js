// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "animate.css";
import "../styles/Navbar.css";

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar animate__animated animate__fadeInDown">
      <div className="logo">
        <Link to="/">🛫 FlyFast</Link>
      </div>
      <ul className="nav-links">
        {!user ? (
          <>
            <li><Link to="/login">🔐 Login</Link></li>
            <li><Link to="/register">📝 Register</Link></li>
          </>
        ) : (
          <>
            <li className="user-info">👤 {user.userEmail}</li>
            <li><button onClick={onLogout} className="logout-btn">🚪 Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
