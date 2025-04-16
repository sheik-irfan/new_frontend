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
  const [isValid, setIsValid] = useState(true); // Check for valid state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  // Debugging state info
  useEffect(() => {
    console.log("BookingPage: flight =", flight);
    console.log("BookingPage: userId =", userId);
    console.log("BookingPage: token =", token);

    if (!flight || !userId || !token) {
      setIsValid(false); // Prevent rendering UI if state is invalid
      alert("Invalid access. Redirecting to homepage.");
      navigate("/"); // Redirect to homepage
    } else {
      fetchWallet();
    }
  }, [flight, userId, token, navigate]);

  const fetchWallet = async () => {
    try {
      const res = await axios.get(`${API_URL}/wallets/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Wallet data fetched:", res.data); // Check wallet data in console
      setWallet(res.data);
    } catch (err) {
      console.error("Failed to fetch wallet", err);
      setErrorMessage("Error fetching wallet details.");
    }
  };

  const confirmBooking = async () => {
    if (!wallet || wallet.balance < flight?.price) {
      alert("Insufficient balance. Please top up your wallet.");
      return;
    }

    setLoading(true);
    setErrorMessage(""); // Reset error message
    console.log("Confirming booking..."); // Log when booking starts

    try {
      // Create booking request data
      const bookingRequest = {
        userId: userId,
        flightId: flight.flightId,
        amount: flight.price, // Assuming BookingRequest expects a price field
      };

      // Send booking request to backend
      const response = await axios.post(
        `${API_URL}/bookings`,
        bookingRequest,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bookingResponse = response.data;
      console.log("Booking Response:", bookingResponse); // Log booking response

      if (bookingResponse) {
        alert("Booking confirmed!");
        navigate("/dashboard");
      } else {
        setErrorMessage("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Booking error", err);
      setErrorMessage("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If no state was passed, don’t render anything
  if (!isValid) {
    return <p className="booking-page">Redirecting...</p>;
  }

  return (
    <div className="booking-page">
      <h2>Confirm Your Booking</h2>

      <div className="flight-card">
        <p>✈️ {flight?.flightNumber}</p>
        <p>{flight?.source} → {flight?.destination}</p>
        <p>📅 {flight?.departureDate} | 🕐 {flight?.departureTime} - {flight?.arrivalTime}</p>
        <p>💺 Airplane: {flight?.airplaneId}</p>
        <p>💰 Price: ₹{flight?.price}</p>
      </div>

      <div className="wallet-info">
        <h3>Wallet Balance</h3>
        {wallet ? <p>₹{wallet.balance}</p> : <p>Loading wallet...</p>}
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Show error message if any */}

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
