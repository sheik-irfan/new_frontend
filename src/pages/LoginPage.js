import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css"; // optional CSS
import "animate.css";

const API_URL = "http://localhost:1212/api";

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
      const res = await axios.post(`${API_URL}/login`, {
        userEmail,
        userPassword,
      });

      const { token, role, id } = res.data;

      const user = {
        userEmail,
        userRole: role,
        userId: id,
      };

      // Save to local or session storage
      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      //  Correct parameter order: token, then user
      onLogin(token, user);

      //  Navigate based on user role
      if (role === "CUSTOMER") {
        navigate("/dashboard"); //  Customer goes to customer dashboard Page
      } else if (role === "ADMIN") {
        navigate("/admin"); //  Admin goes to Admin Dashboard
      } else {
        setError("Access denied: Unrecognized role.");
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
