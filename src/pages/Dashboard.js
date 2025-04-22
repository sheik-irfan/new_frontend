import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import { jwtDecode } from "jwt-decode";
import "../styles/Dashboard.css";

const API_URL = "http://localhost:1212/api";

const Dashboard = ({ token, userId, userRole, onLogout }) => {
  const [flights, setFlights] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Check if search results are passed from the HomePage via location state
  const searchResults = location.state?.searchResults;

  // Fetch wallet data for customers
  const fetchWallet = async () => {
    if (!userId || userRole !== "CUSTOMER") return;

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setError("User not authenticated.");
      setWalletLoading(false);
      return;
    }

    try {
      jwtDecode(token); // Just to validate token, no need to extract userId
    } catch (err) {
      console.error("JWT decode error:", err);
      setError("Invalid token.");
      setWalletLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWallet(res.data);
    } catch (err) {
      console.error("Failed to fetch wallet", err);
      setError("Could not load wallet.");
    } finally {
      setWalletLoading(false);
    }
  };

  const handleAddMoney = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token || !amountToAdd || isNaN(amountToAdd) || parseFloat(amountToAdd) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/wallet/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ balance: parseFloat(amountToAdd) }),
      });

      if (!res.ok) {
        throw new Error(`Failed to add money: ${res.status}`);
      }

      const updatedWallet = await res.json();
      setWallet(updatedWallet);
      setAmountToAdd("");
      setSuccess("✅ Money added successfully!");
      setError("");
    } catch (err) {
      console.error("Add money error:", err);
      setError("Failed to add money to wallet.");
      setSuccess("");
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
    } catch {
      alert("Booking failed");
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [userId]);

  useEffect(() => {
    if (!collapsed) {
      const timeout = setTimeout(() => {
        setCollapsed(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [location]);

  return (
    <div className="dashboard-wrapper">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} onLogout={onLogout} />

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

        {/* Display flights passed from HomePage or fetched from API */}
        {searchResults?.length > 0 ? (
          <ul className="flight-list">
            {searchResults.map((flight, idx) => (
              <motion.li
                key={flight.flightId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                {flight.flightNumber} — {flight.source} → {flight.destination} on{" "}
                {new Date(flight.departureDate).toLocaleDateString()}
                <button onClick={() => bookFlight(flight.flightId)}>Book</button>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p>No flights available for your search.</p>
        )}

        {/* Display wallet section if the user is a customer */}
        {userRole === "CUSTOMER" && (
          <>
            <h2>💰 Wallet</h2>
            {walletLoading ? (
              <p>Loading wallet...</p>
            ) : wallet ? (
              <>
                <p className="wallet-balance">Balance: ₹{wallet.balance.toLocaleString()}</p>
                <div style={{ marginTop: "1rem" }}>
                  <input
                    type="number"
                    placeholder="Enter amount to add"
                    value={amountToAdd}
                    onChange={(e) => setAmountToAdd(e.target.value)}
                    style={{ padding: "8px", marginRight: "10px", width: "200px" }}
                  />
                  <button onClick={handleAddMoney} style={{ padding: "8px 16px" }}>
                    ➕ Add Money
                  </button>
                  {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
                </div>
              </>
            ) : (
              <p className="wallet-balance">❌ Wallet unavailable.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
