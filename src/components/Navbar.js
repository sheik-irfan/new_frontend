import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import "animate.css";
import "../styles/Navbar.css";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [animationClass, setAnimationClass] = useState("animate__fadeInDown");
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const handleLogoClick = () => {
    clickCountRef.current++;

    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    clickTimeoutRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 500); // Reset after 500ms

    if (clickCountRef.current >= 3) {
      triggerDropdown();
      clickCountRef.current = 0;
    }
  };

  const triggerDropdown = () => {
    setShowDropdown(true);
    setAnimationClass("animate__fadeInDown");

    // Fire confetti
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });

    // Play sound
    const audio = new Audio("https://www.myinstants.com/media/sounds/yeah-boy.mp3");
    audio.play();

    // Auto-hide after 3 seconds with fade out
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setAnimationClass("animate__fadeOutUp");
      setTimeout(() => {
        setShowDropdown(false);
      }, 500); // Wait for fade out animation to finish
    }, 3000);
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <nav className="navbar animate__animated animate__fadeInDown">
      <div className="logo" onClick={handleLogoClick}>
        <Link to="/">🛫 FlyFast</Link>
      </div>

      {showDropdown && (
        <div className={`dropdown animate__animated ${animationClass}`}>
          <span className="glow-text rainbow-text">✨ Catalyst Coders ✨</span>
        </div>
      )}

      <ul className="nav-links">
        {!user ? (
          <>
            <li><Link to="/login"> Login</Link></li>
            <li><Link to="/register"> Register</Link></li>
            <li><Link to="/about"> About Us</Link></li>
          </>
        ) : (
          <>
            <li className="user-info">👤 {user.userEmail.split('@')[0]}</li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
