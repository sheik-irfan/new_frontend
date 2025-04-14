// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";
import "animate.css";

const API_URL = "http://localhost:1212/api";

const Dashboard = ({ token, userId, onLogout }) => {
  const [flights, setFlights] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [airplanes, setAirplanes] = useState([]);

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

  const fetchAirplanes = async () => {
    try {
      const res = await axios.get(`${API_URL}/airplanes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAirplanes(res.data);
    } catch (err) {
      console.error("Failed to fetch airplanes", err);
    }
  };

  const bookFlight = async (flightId) => {
    try {
      await axios.post(
        `${API_URL}/bookings`,
        { userId, flightId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("🎉 Flight booked successfully!");
    } catch (err) {
      alert("❌ Booking failed");
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
      alert("✅ Wallet topped up successfully!");
    } catch (err) {
      alert("❌ Top-up failed");
    }
  };

  useEffect(() => {
    fetchFlights();
    fetchWallet();
    fetchAirplanes();
  }, []);

  return (
    <div className="dashboard-container animate__animated animate__fadeIn">
      <aside className="sidebar animate__animated animate__fadeInLeft animate__delay-1s">
        <h2 className="animate__animated animate__fadeInDown animate__faster">Dashboard</h2>
        <nav>
          <ul>
            <li><Link to="/flights">✈️ View Flights</Link></li>
            <li><Link to="/airports">🛫 Airports</Link></li>
            <li><Link to="/airplanes">🛬 Airplanes</Link></li>
            <li><Link to="/wallet">💰 Wallet</Link></li>
            <li><Link to="/bookings">📄 Booking History</Link></li>
            {userId && <li><Link to="/admin">🛠 Admin Dashboard</Link></li>}
            <li><button className="logout-btn" onClick={onLogout}>🚪 Logout</button></li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main animate__animated animate__fadeInUp animate__delay-1s">
        <h1 className="animate__animated animate__zoomIn">🎯 Welcome to Your Flight Dashboard</h1>

        <h2>Available Flights</h2>
        <ul className="flight-list">
          {flights.map((flight) => (
            <li key={flight.flightId} className="animate__animated animate__fadeInUp animate__faster">
              ✈️ <strong>{flight.flightNumber}</strong> — {flight.source} → {flight.destination} on <em>{flight.departureDate}</em>
              <button onClick={() => bookFlight(flight.flightId)}>Book</button>
            </li>
          ))}
        </ul>

        <h2>Airplanes</h2>
        <ul className="flight-list">
          {airplanes.map((airplane) => (
            <li key={airplane.airplaneId} className="animate__animated animate__fadeInUp animate__faster">
              🛬 <strong>{airplane.model}</strong> — {airplane.manufacturer} | Capacity: {airplane.capacity}
            </li>
          ))}
        </ul>

        <h2>Wallet</h2>
        {wallet ? (
          <p className="animate__animated animate__fadeIn">💰 Balance: ₹{wallet.balance.toLocaleString()}</p>
        ) : (
          <button onClick={fetchWallet}>Load Wallet</button>
        )}
        <div>
          <button onClick={() => topUpWallet(1000)}>Top Up ₹1000</button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
