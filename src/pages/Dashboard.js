import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Dashboard.css";

const API_URL = "http://localhost:1212/api";

const Dashboard = ({ token, userId, userRole }) => {
  const [flights, setFlights] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

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

  const topUpWallet = async (amount) => {
    try {
      await axios.post(
        `${API_URL}/wallet/add`,
        { userId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWallet();
      alert("Wallet topped up successfully!");
    } catch (err) {
      alert("Top-up failed");
      console.error(err);
    }
  };

  const handleBookClick = (flight) => {
    navigate("/book", { state: { flight, userId, token } });
  };

  useEffect(() => {
    fetchFlights();
    fetchWallet();
  }, [userId, token, userRole]);

  return (
    <motion.div
      className={`dashboard-container ${sidebarOpen ? "sidebar-open" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      >
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? "❮" : "❯"}     {/* {sidebarOpen ? "✕" : "≡"} */}
        </div>
        <h2>Dashboard</h2>
        <ul>
          <li><Link to="/wallet">Wallet</Link></li>
          <li><Link to="/bookings">Booking History</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <motion.h1
          className="animate__animated animate__fadeInDown"
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
              className="flight-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              >
              <div className="flight-meta">
                <div className="flight-date">Date: {flight.departureDate}</div>
                <div className="airline-info">
                  <span className="airline">{flight.airline}</span>
                  <span className="flight-number">({flight.flightNumber})</span>
                </div>
              </div>
              <div className="flight-times">
                <div className="flight-block">
                  <div className="time">{flight.departureTime}</div>
                  <div className="airport-code">{flight.source}</div>
                </div>
                <div className="flight-middle">
                  <div className="duration">{flight.duration}</div>
                  <div className="flight-path">
                    <div className="line" />
                    <div className="plane-icon">✈</div>
                    <div className="line" />
                  </div>
                  <div className="flight-type">Direct</div>
                </div>
                <div className="flight-block">
                  <div className="time">{flight.arrivalTime}</div>
                  <div className="airport-code">{flight.destination}</div>
                </div>
              </div>
              <div className="flight-bottom">
                <div className="price-block">
                  <div className="label">Fare</div>
                  <div className="price">₹{flight.price?.toLocaleString()}</div>
                </div>
                <button className="book-button" onClick={() => handleBookClick(flight)}>
                  Book Now →
                </button>
              </div>
            </motion.li>
          ))}
        </ul>

        {/* Wallet Section */}
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