// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import WalletPage from "./pages/WalletPage";
import FlightPage from "./pages/FlightPage";
import Airplanes from "./pages/Airplanes";
import Airports from "./pages/Airports";
import BookingHistoryPage from "./pages/BookingHistoryPage";

import 'animate.css';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const handleLogin = (userData, token) => {
    setUser(userData);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            user?.userRole === "CUSTOMER" ? (
              <Dashboard token={token} userId={user.userId} onLogout={handleLogout} />
            ) : (
              <p className="animate__animated animate__shakeX">Access Denied</p>
            )
          }
        />
        {/* Add other routes here */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/airports" element={<Airports token={token} />} />
        <Route path="/airplanes" element={<Airplanes token={token} />} />

        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/flights" element={<FlightPage token={token} userId={user?.userId} />} />
        <Route path="/bookings" element={<BookingHistoryPage token={token} userId={user?.userId} />} />
      </Routes>
    </Router>
  );
}

export default App;
