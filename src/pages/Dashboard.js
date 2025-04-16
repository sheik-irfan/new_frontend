// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { motion } from "framer-motion";
import "../styles/Dashboard.css";

const API_URL = "http://localhost:1212/api";

const Dashboard = ({ token, userId, userRole }) => {
  const [flights, setFlights] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);

  const navigate = useNavigate(); // ✅ Initialize navigation hook

  // Fetch all available flights
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

  // Fetch wallet for customer role
  const fetchWallet = async () => {
    if (!userId || userRole !== "CUSTOMER") return;

    try {
      const res = await axios.get(`${API_URL}/wallets/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWallet(res.data);
    } catch (err) {
      console.warn("Wallet not found, attempting to create...");
      await createWallet();
    } finally {
      setWalletLoading(false);
    }
  };

  // Create a new wallet if not exists
  const createWallet = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/wallets/create?userId=${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWallet(res.data);
    } catch (err) {
      console.error("Failed to create wallet", err);
    }
  };

  // Add amount to wallet
  const topUpWallet = async (amount) => {
    try {
      await axios.post(
        `${API_URL}/wallet/add`,
        { userId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWallet(); // Refresh wallet balance
      alert("Wallet topped up successfully!");
    } catch (err) {
      alert("Top-up failed");
      console.error(err);
    }
  };

  // Handle Book button click — navigate to booking page with flight info
  const handleBookClick = (flight) => {
    navigate("/book", { state: { flight, userId, token } }); // ✅ Pass flight info using router state
  };

  useEffect(() => {
    fetchFlights();
    fetchWallet();
  }, [userId, token, userRole]);

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
            <li><Link to="/wallet"> Wallet</Link></li>
            <li><Link to="/bookings">Booking History</Link></li>
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
          Available Flights
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
              {/* ✅ Book button now navigates to booking page */}
              <button onClick={() => handleBookClick(flight)}>Book</button>
            </motion.li>
          ))}
        </ul>

        {userRole === "CUSTOMER" && (
          <>
            <h2>Wallet</h2>
            {walletLoading ? (
              <p>Loading wallet...</p>
            ) : wallet ? (
              <>
                <p className="wallet-balance">Balance: ₹{wallet.balance.toLocaleString()}</p>
                <div>
                  <button onClick={() => topUpWallet(1000)}>Top Up ₹1000</button>
                </div>
              </>
            ) : (
              <p className="wallet-balance">Wallet unavailable.</p>
            )}
          </>
        )}
      </main>
    </motion.div>
  );
};

export default Dashboard;
