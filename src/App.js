// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import Wallet from "./pages/Wallet";
import FlightPage from "./pages/FlightPage";
import Airplanes from "./pages/Airplanes";
import Airports from "./pages/Airports";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAirplanes from "./pages/AdminAirplanes";
import "animate.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminFlights from "./pages/AdminFlights";
import AdminAirports from "./pages/AdminAirports";
import AdminUsers from "./pages/AdminUsers";
import BookingPage from "./pages/BookingPage";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token/user from localStorage or sessionStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // When user logs in
  const handleLogin = (receivedToken, receivedUser) => {
    setToken(receivedToken);
    setUser(receivedUser);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    setToken(null);
  };

  // Show loading indicator while checking auth
  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutUs />} />

        {/* Role-based Routing */}
        <Route
          path="/dashboard"
          element={
            user?.userRole === "CUSTOMER" ? (
              <Dashboard token={token} userId={user.userId} userRole={user.userRole} onLogout={handleLogout} />
            ) : (
              <p className="animate__animated animate__shakeX">Access Denied</p>
            )
          }
        />

        <Route
          path="/admin"
          element={
            user?.userRole === "ADMIN" ? (
              <AdminDashboard token={token} userId={user.userId} />
            ) : (
              <p className="animate__animated animate__shakeX">Access Denied</p>
            )
          }
        />

        {/* Shared pages */}
        <Route path="/adminflights" element={<AdminFlights token={token} userId={user?.userId} />} />
        <Route

path="/wallet"
element={
  user?.userRole === "CUSTOMER" ? (
    <Wallet token={token} userId={user?.userId} userRole={user?.userRole} />
  ) : (
    <p className="animate__animated animate__shakeX">❌ Access Denied</p>
  )
}/>


        <Route path="/airports" element={<Airports token={token} />} />
        <Route path="/airplanes" element={<Airplanes token={token} />} />
        <Route path ="adminairplanes" element={<AdminAirplanes token={token} />} />
        <Route path="/adminairports" element={<AdminAirports token={token} />} />
        <Route path="/adminusers" element={<AdminUsers token={token} />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/flights" element={<FlightPage token={token} userId={user?.userId} />} />
        <Route path="/bookings" element={<BookingHistoryPage token={token} userId={user?.userId} />} />
      </Routes>
    </Router>
  );
}

export default App;
