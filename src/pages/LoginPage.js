import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import "../styles/LoginPage.css"; // optional CSS
import "animate.css";
import { jwtDecode } from "jwt-decode";
 
const API_URL = "http://localhost:1212/api";
 
const LoginPage = ({ onLogin }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Used to access state passed during navigation
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
 
    try {
      // Send login request to backend
      const res = await axios.post(`${API_URL}/login`, {
        userEmail,
        userPassword,
      });
 
      const { token, role, id } = res.data;
 
      // Decode JWT token and get user details
      let user;
      try {
        const decoded = jwtDecode(token);
        user = {
          userEmail: decoded.sub || userEmail, // Use email from decoded token if available
          userRole: decoded.role || role,
          userId: decoded.userId || id,
        };
      } catch (err) {
        console.error("JWT decode error:", err);
        setError("❌ Failed to decode JWT token.");
        return;
      }
 
      // Always store token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
 
      // Pass token and user details to parent component (e.g. App.js)
      onLogin(token, user);
 
      // Check if user came from HomePage with flight search criteria
      const searchCriteria = location.state?.searchCriteria; // Retrieve search criteria from location state
 
      if (searchCriteria) {
        // Redirect to /flights with search details
        navigate("/flights", { state: { searchCriteria } });
      } else {
        // Redirect based on user role
        if (role === "CUSTOMER") {
          navigate("/dashboard");
        } else if (role === "ADMIN") {
          navigate("/admin");
        } else {
          setError("❌ Access denied: Unrecognized role.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("❌ Invalid email or password.");
    }
  };
 
  return (
<div className="auth-container animate__animated animate__fadeIn">
<h2 className="animate__animated animate__fadeInDown">Login</h2>
<form onSubmit={handleLogin} className="login-form">
<input
          type="email"
          placeholder="Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
<input
          type="password"
          placeholder="Password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          required
        />
<label className="remember-me">
<input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember me
</label>
<button type="submit" className="btn-login">
          Login
</button>
        {error && <p className="error animate__animated animate__shakeX">{error}</p>}
</form>
</div>
  );
};
 
export default LoginPage;