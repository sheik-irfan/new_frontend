// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Dashboard.css";

const API_URL = "http://localhost:1212/api";

const Dashboard = ({ token, userId, onLogout }) => {
  const [flights, setFlights] = useState([]);
  const [wallet, setWallet] = useState(null);

  const fetchFlights = async () => {
    try {
      const res = await axios.get(`${API_URL}/flights`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights(res.data);
    } catch (err) {
      console.error("Failed to fetch flights", err);
    }
  };

  const fetchWallet = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/wallets/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWallet(res.data);
    } catch (err) {
      console.error("Failed to fetch wallet", err);
    }
  };

  const bookFlight = async (flightId) => {
    try {
      await axios.post(
        `${API_URL}/bookings`,
        { userId, flightId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Flight booked successfully!");
    } catch (err) {
      alert("Booking failed");
    }
  };

  const topUpWallet = async (amount) => {
    try {
      await axios.post(
        `${API_URL}/wallets/topup`,
        { userId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWallet();
      alert("Wallet topped up successfully!");
    } catch (err) {
      alert("Top-up failed");
    }
  };

  useEffect(() => {
    fetchFlights();
    fetchWallet();
  }, []);

  return (
    <motion.div
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <ul>
            <li><Link to="/flights">✈️ View Flights</Link></li>
            <li><Link to="/airports">🛫 Airports</Link></li>
            <li><Link to="/airplanes">🛬 Airplanes</Link></li>
            <li><Link to="/wallet">💰 Wallet</Link></li>
            <li><Link to="/bookings">📄 Booking History</Link></li>
            <li><button className="logout-btn" onClick={onLogout}>🚪 Logout</button></li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to Your Flight Dashboard
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ✈️ Available Flights
        </motion.h2>

        <ul className="flight-list">
          {flights.map((flight, idx) => (
            <motion.li
              key={flight.flightId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {flight.flightNumber} — {flight.source} → {flight.destination} on {flight.departureDate}
              <button onClick={() => bookFlight(flight.flightId)}>Book</button>
            </motion.li>
          ))}
        </ul>

        <h2>💰 Wallet</h2>
        {wallet ? (
          <p className="wallet-balance">Balance: ₹{wallet.balance.toLocaleString()}</p>
        ) : (
          <button onClick={fetchWallet}>Load Wallet</button>
        )}
        <div>
          <button onClick={() => topUpWallet(1000)}>Top Up ₹1000</button>
        </div>
      </main>
    </motion.div>
  );
};

export default Dashboard;
