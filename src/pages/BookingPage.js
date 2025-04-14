// src/pages/BookingPage.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/BookingPage.css";

const API_URL = "http://localhost:1212/api";

const BookingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { flight, userId, token } = state || {};
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWallet = async () => {
    try {
      const res = await axios.get(`${API_URL}/wallets/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWallet(res.data);
    } catch (err) {
      console.error("Failed to fetch wallet", err);
    }
  };

  const confirmBooking = async () => {
    if (!wallet || wallet.balance < flight.price) {
      alert("Insufficient balance. Please top up your wallet.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/bookings`,
        { userId, flightId: flight.flightId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Booking confirmed!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Booking error", err);
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!flight || !userId || !token) {
      alert("Invalid access");
      navigate("/");
      return;
    }
    fetchWallet();
  }, []);

  return (
    <div className="booking-page">
      <h2>Confirm Your Booking</h2>
      <div className="flight-card">
        <p>✈️ {flight.flightNumber}</p>
        <p>{flight.source} → {flight.destination}</p>
        <p>📅 {flight.departureDate} | 🕐 {flight.departureTime} - {flight.arrivalTime}</p>
        <p>💺 Airplane: {flight.airplaneId}</p>
        <p>💰 Price: ₹{flight.price}</p>
      </div>

      <div className="wallet-info">
        <h3>Wallet Balance</h3>
        {wallet ? <p>₹{wallet.balance}</p> : <p>Loading wallet...</p>}
      </div>

      <button className="confirm-btn" onClick={confirmBooking} disabled={loading}>
        {loading ? "Booking..." : "✅ Confirm Booking"}
      </button>

      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ⬅ Back to Dashboard
      </button>
    </div>
  );
};

export default BookingPage;
