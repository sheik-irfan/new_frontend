// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css";
import { registerUser } from "../services/RegisterService";
 
const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    confirmPassword: "",
    userGender: "",
    userRole: "CUSTOMER",
  });
 
  const [errors, setErrors] = useState({});
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const validateForm = () => {
    const newErrors = {};
 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.userEmail)) {
      newErrors.userEmail = "Invalid email address";
    }
 
    if (form.userPassword.length < 8) {
      newErrors.userPassword = "Password must be at least 8 characters";
    }
 
    if (form.userPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
 
    if (!["Male", "Female", "Other"].includes(form.userGender)) {
      newErrors.userGender = "Please select a valid gender";
    }
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleRegister = async () => {
    if (!validateForm()) return;
 
    try {
      await registerUser(form);
      alert("Registration successful! You can now login.");
      navigate("/login");
    } catch (err) {
      console.error("Backend error:", err);
      alert("Registration failed. Please try again or check your input.");
    }
  };
 
  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Register</h2>
 
        <input
          type="text"
          name="userName"
          placeholder="Name"
          onChange={handleChange}
        />
 
        <input
          type="email"
          name="userEmail"
          placeholder="Email"
          onChange={handleChange}
        />
        {errors.userEmail && <span className="error">{errors.userEmail}</span>}
 
        <select name="userGender" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.userGender && <span className="error">{errors.userGender}</span>}
 
        <input
          type="password"
          name="userPassword"
          placeholder="Password"
          onChange={handleChange}
        />
        {errors.userPassword && <span className="error">{errors.userPassword}</span>}
 
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
        />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
 
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};
 
export default RegisterPage;