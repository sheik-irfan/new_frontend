import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
 
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Airports from "./pages/Airports";
import Airplanes from "./pages/Airplanes";
import Wallet from "./pages/Wallet";
import FlightPage from "./pages/FlightPage";
import BookingHistoryPage from "./pages/BookingHistoryPage";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
 
import 'animate.css';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
 
function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
 
  const handleLogin = (userData, token) => {
    setUser(userData);
    setToken(token);
  };
 
  const handleLogout = () => {
    setUser(null);
    setToken("");
    localStorage.clear();
  };
 
  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            user
              ? user.userRole === "ADMIN"
                ? <Navigate to="/admin" />
                : <Navigate to="/dashboard" />
              : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={
            user?.userRole === "CUSTOMER"
              ? <Dashboard token={token} userId={user.userId} onLogout={handleLogout} />
              : <Navigate to="/login" />
          }
        />
        <Route
          path="/admin"
          element={
            user?.userRole === "ADMIN"
              ? <AdminDashboard token={token} userRole={user.userRole} />
              : <Navigate to="/login" />
          }
        />
        <Route path="/flights" element={<FlightPage token={token} userId={user?.userId} />} />
        <Route path="/airports" element={<Airports token={token} />} />
        <Route path="/airplanes" element={<Airplanes token={token} />} />
        <Route path="/wallet" element={<Wallet token={token} userId={user?.userId} />} />
        <Route path="/bookings" element={<BookingHistoryPage token={token} userId={user?.userId} />} />
      </Routes>
    </Router>
  );
}
 
export default App;