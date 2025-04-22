// src/pages/BookingPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/BookingPage.css";

const API_URL = "http://localhost:1212/api";

const BookingPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [airplane, setAirplane] = useState(null); // State to store airplane details

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  useEffect(() => {
    if (!token || !userId || !flightId) {
      alert("Unauthorized or missing data.");
      navigate("/");
      return;
    }

    fetchFlightDetails();
    fetchWallet();
  }, [flightId, userId, token, navigate]);

  useEffect(() => {
    if (flight && flight.airplaneId) {
      fetchAirplaneDetails(flight.airplaneId); // Fetch airplane details when the flight is fetched
    }
  }, [flight]);

  const fetchFlightDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/flights/${flightId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlight(res.data);
    } catch (err) {
      console.error("Failed to fetch flight details", err);
      alert("Flight not found.");
      navigate("/");
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await axios.get(`${API_URL}/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWallet(res.data);
    } catch (err) {
      console.error("Failed to fetch wallet", err);
    }
  };

  const fetchAirplaneDetails = async (airplaneId) => {
    try {
      const res = await axios.get(`${API_URL}/airplanes/${airplaneId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAirplane(res.data); // Store airplane details
    } catch (err) {
      console.error("Failed to fetch airplane details", err);
    }
  };

  const confirmBooking = async () => {
    if (!wallet || wallet.balance < flight.price) {
      alert("Insufficient balance. Please top up your wallet.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/bookings`,
        { flightId: flight.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingDetails(res.data);
      alert("✅ Booking confirmed!");
    } catch (err) {
      console.error("Booking error", err);
      alert("❌ Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!flight) return <p style={{ padding: "2rem" }}>Loading flight details...</p>;

  return (
    <div className="booking-page">
      <h2>Confirm Your Booking</h2>

      <div className="flight-card">
        <p>✈️ {flight.flightNumber || flight.airline}</p>
        <p>
          {flight.fromAirportName} → {flight.toAirportName}
        </p>
        <p>
          📅 {new Date(flight.departureTime).toLocaleDateString()} | 🕐{" "}
          {new Date(flight.departureTime).toLocaleTimeString()} -{" "}
          {new Date(flight.arrivalTime).toLocaleTimeString()}
        </p>
        <p>💺 Airplane ID: {flight.airplaneId}</p>
        {airplane && (
          <p>🛫 Airplane Model: {airplane.airplaneModel}</p>
        )}
        <p>💰 Price: ₹{flight.price}</p>
      </div>

      <div className="wallet-info">
        <h3>Wallet Balance</h3>
        {wallet ? <p>₹{wallet.balance}</p> : <p>Loading wallet...</p>}
      </div>

      {!bookingDetails ? (
        <button className="confirm-btn" onClick={confirmBooking} disabled={loading}>
          {loading ? "Booking..." : "✅ Confirm Booking"}
        </button>
      ) : (
        <div className="booking-success">
          <h3>🎉 Booking Successful!</h3>
          <p>Booking ID: {bookingDetails.bookingId}</p>
          <p>Total: ₹{bookingDetails.totalAmount}</p>
          <p>Booking Time: {new Date(bookingDetails.bookingTime).toLocaleString()}</p>
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ⬅ Back to Dashboard
          </button>
        </div>
      )}

      {!bookingDetails && (
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      )}
    </div>
  );
};

export default BookingPage;
