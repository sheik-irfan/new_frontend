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

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordMatch(form.userPassword === value);
  };

  const handleRegister = async () => {
    if (form.userPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (form.userPassword.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      console.log("Sending payload:", form);
      const response = await axios.post(`${API_URL}/register`, form);
      alert("Registration successful! You can now login.");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
        "Registration failed. Please check the details."
      );
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
        <select
          name="userGender"
          value={form.userGender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="FEMALE">Female</option>
          <option value="MALE">Male</option>
        </select>
        <input
          type="password"
          name="userPassword"
          placeholder="Password"
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleConfirmPasswordChange}
        />
        {!passwordMatch && (
          <p style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
            Passwords do not match.
          </p>
        )}
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default RegisterPage;
