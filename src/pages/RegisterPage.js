// src/pages/RegisterPage.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css";

const API_URL = "http://localhost:1212/api";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    userGender: "",
    userRole: "CUSTOMER",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${API_URL}/register`, form);
      alert("Registration successful! You can now login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed. Please check the details.");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Register</h2>
        <input type="text" name="userName" placeholder="Name" onChange={handleChange} />
        <input type="email" name="userEmail" placeholder="Email" onChange={handleChange} />
        <input type="password" name="userPassword" placeholder="Password" onChange={handleChange} />
        <input type="text" name="userGender" placeholder="Gender" onChange={handleChange} />
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default RegisterPage;
