import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import "animate.css";
import "../styles/Navbar.css";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [clicks, setClicks] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const clickTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  // const audioRef = useRef(new Audio("/sounds/pop.mp3"));

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const handleLogoClick = () => {
    setClicks(prev => prev + 1);
    clearTimeout(clickTimeoutRef.current);

    clickTimeoutRef.current = setTimeout(() => {
      setClicks(0);
    }, 600);
  };

  useEffect(() => {
    if (clicks === 3) {
      setClicks(0);
      setShowDropdown(true);

      // Play sound
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Hide dropdown after 3s
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = setTimeout(() => {
        hideTimeoutRef.current = setTimeout(() => {
          console.log("Hiding dropdown now...");
          setShowDropdown(false);
        }, 300);
        
        setShowDropdown(false);
      }, 300);
    }

    return () => {
      clearTimeout(clickTimeoutRef.current);
      clearTimeout(hideTimeoutRef.current);
    };
  }, [clicks]);

  return (
    <nav className="navbar animate__animated animate__fadeInDown">
      <div className="logo" onClick={handleLogoClick}>
        <Link to="/">🛫 FlyFast</Link>
        {showDropdown && (
          <div className="dropdown animate__animated animate__fadeInDown">
            <span className="glow-text">✨ Sheik Irfan ✨</span>
          </div>
        )}
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
            <li><button onClick={handleLogout} className="logout-btn">🚪 Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
