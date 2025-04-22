import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:1212/api";

const BookingPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [airplane, setAirplane] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (!token || !flightId) {
      setError("Unauthorized or missing data.");
      return;
    }

    fetchFlightDetails();
    fetchWallet();
  }, []);

  const fetchFlightDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/flights/${flightId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlight(response.data);
      fetchAirplaneDetails(response.data.airplaneId);
    } catch (err) {
      console.error("Error fetching flight:", err);
      setError("Could not load flight.");
    }
  };

  const fetchAirplaneDetails = async (airplaneId) => {
    try {
      const response = await axios.get(`${API_URL}/airplanes/${airplaneId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAirplane(response.data);
    } catch (err) {
      console.error("Error fetching airplane:", err);
    }
  };

  const fetchWallet = async () => {
    try {
      const response = await fetch(`${API_URL}/wallet`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Wallet fetch failed: ${response.status}`);
      }

      const walletData = await response.json();
      setWallet(walletData);
    } catch (err) {
      console.error("Wallet fetch error:", err);
      setError("Could not fetch wallet balance.");
    }
  };

  const handleBooking = async () => {
    if (!wallet || !flight) return;

    if (wallet.balance < flight.price) {
      alert("⚠️ Insufficient balance. Please top up your wallet.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/bookings`,
        { flightId: flight.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Booking successful!");
      navigate("/bookings");
    } catch (err) {
      console.error("Booking failed:", err);
      alert("❌ Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div style={{ padding: "2rem", color: "red" }}>{error}</div>;
  if (!flight) return <p style={{ padding: "2rem" }}>Loading flight info...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Confirm Your Booking</h2>
      <div style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
        <p>✈️ {flight.airline || "Air Bharat"}</p>
        <p>{flight.fromAirportName} → {flight.toAirportName}</p>
        <p>
          📅 {new Date(flight.departureTime).toLocaleDateString()} | 🕐{" "}
          {new Date(flight.departureTime).toLocaleTimeString()} -{" "}
          {new Date(flight.arrivalTime).toLocaleTimeString()}
        </p>

        {airplane ? (
          <p>💺 Airplane: {airplane.airplaneName} ({airplane.airplaneModel})</p>
        ) : (
          <p>Loading airplane info...</p>
        )}

        <p>💰 Price: ₹{flight.price}</p>
      </div>

      {wallet ? (
        <div>
          <p><strong>Wallet Balance:</strong> ₹{wallet.balance}</p>
          <button
            onClick={handleBooking}
            disabled={loading}
            style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}
          >
            {loading ? "Booking..." : "✅ Confirm Booking"}
          </button>
        </div>
      ) : (
        <p>Loading wallet...</p>
      )}
    </div>
  );
};

export default BookingPage;
