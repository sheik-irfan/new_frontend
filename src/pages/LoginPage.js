// src/pages/LoginPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/LoginPage.css";

const API_URL = "http://localhost:1212/api";

const LoginPage = ({ onLogin }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/login`, {
        userEmail,
        userPassword,
      });

      const { token, role, userId } = res.data;

      const user = { userEmail, userRole: role, userId };

      if (remember) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      onLogin(user, token);
      toast.success("Login successful!", { position: "top-center" });

      if (role === "CUSTOMER") {
        navigate("/dashboard");
      } else {
        toast.error("Role not supported yet");
      }
    } catch (err) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container animate__animated animate__fadeIn">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login to FlyAway</h2>
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
        <label className="remember-label">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          Remember me
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
