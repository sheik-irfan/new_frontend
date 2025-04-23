// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import "animate.css";
import { loginUser } from "../services/LoginService";
 
const LoginPage = ({ onLogin }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
 
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
 
    try {
      const { token, user } = await loginUser(userEmail, userPassword);
 
      onLogin(token, user);
 
      if (user.userRole === "CUSTOMER") {
        navigate("/dashboard");
      } else if (user.userRole === "ADMIN") {
        navigate("/admin");
      } else {
        setError("❌ Access denied: Unrecognized role.");
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