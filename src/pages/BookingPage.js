import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import { motion } from "framer-motion";
import "../styles/BookingPage.css"; // Updated CSS file for styling

const API_URL = "http://localhost:1212/api";

const BookingPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [airplane, setAirplane] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengerDetails, setPassengerDetails] = useState([{ name: "", age: "", gender: "" }]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  useEffect(() => {
    if (!token || !userId || !flightId) {
      alert("Unauthorized or missing data.");
      navigate("/login");
      return;
    }

    fetchFlightDetails();
    fetchWallet();
  }, [flightId, userId, token, navigate]);

  const fetchFlightDetails = async () => {
    try {
      const res = await axios.get(`${API_URL}/flights/${flightId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlight(res.data);
      if (res.data.airplaneId) {
        fetchAirplaneDetails(res.data.airplaneId);
      }
    } catch (err) {
      handleError(err, "Failed to fetch flight details");
      navigate("/flights");
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await axios.get(`${API_URL}/wallet`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWallet(res.data);
    } catch (err) {
      handleError(err, "Failed to fetch wallet");
    }
  };

  const fetchAirplaneDetails = async (airplaneId) => {
    try {
      const res = await axios.get(`${API_URL}/airplanes/${airplaneId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAirplane(res.data);
    } catch (err) {
      handleError(err, "Failed to fetch airplane details");
    }
  };

  const handleError = (err, message) => {
    console.error(`❌ ${message}:`, err.response?.data || err.message);
    if (err.response?.status === 401) {
      alert("Session expired. Please log in again.");
      navigate("/login");
    } else {
      alert(`${message}: ${err.response?.data?.message || err.message}`);
    }
  };

  const handlePassengerChange = (index, event) => {
    const values = [...passengerDetails];
    values[index][event.target.name] = event.target.value;
    setPassengerDetails(values);
  };

  const handlePassengerCountChange = (event) => {
    let count = Math.max(parseInt(event.target.value), 1);
    setPassengerCount(count);
    setPassengerDetails((prev) => {
      const updated = [...prev];
      if (count > updated.length) {
        while (updated.length < count) updated.push({ name: "", age: "", gender: "" });
      } else {
        updated.splice(count);
      }
      return updated;
    });
  };

  const validatePassengerDetails = () => {
    for (let [i, passenger] of passengerDetails.entries()) {
      if (!passenger.name || !passenger.age || !passenger.gender) {
        alert(`❗ Please fill all fields for Passenger ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const confirmBooking = async () => {
    if (!flight || !wallet) return;

    const totalCost = flight.price * passengerCount;
    if (wallet.balance < totalCost) {
      alert("❌ Insufficient balance. Please top up your wallet.");
      return;
    }

    if (!validatePassengerDetails()) return;

    const mappedPassengers = passengerDetails.map((p) => ({
      passengerName: p.name,
      passengerAge: parseInt(p.age),
      passengerGender: p.gender,
    }));

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/bookings`,
        { flightId: flight.id, passengers: mappedPassengers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingDetails(res.data);
      setWallet((prev) => ({
        ...prev,
        balance: prev.balance - totalCost,
      }));
      alert("✅ Booking confirmed!");
    } catch (err) {
      handleError(err, "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const generateTicket = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Confirmation", doc.internal.pageSize.width / 2, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Flight: ${flight.flightNumber || flight.airline}`, 20, 40);
    doc.text(`From: ${flight.fromAirportName}`, 20, 50);
    doc.text(`To: ${flight.toAirportName}`, 20, 60);
    doc.text(`Departure: ${new Date(flight.departureTime).toLocaleString()}`, 20, 70);
    doc.text(`Arrival: ${new Date(flight.arrivalTime).toLocaleString()}`, 20, 80);
    doc.text(`Price: ₹${flight.price}`, 20, 90);

    passengerDetails.forEach((p, i) => {
      const y = 100 + i * 40;
      doc.text(`Passenger ${i + 1}`, 20, y);
      doc.text(`Name: ${p.name}`, 20, y + 10);
      doc.text(`Age: ${p.age}`, 20, y + 20);
      doc.text(`Gender: ${p.gender}`, 20, y + 30);
    });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const msg = "Thank you for booking with us! Safe travels!";
    const width = doc.getTextWidth(msg);
    doc.text(msg, (doc.internal.pageSize.width - width) / 2, doc.internal.pageSize.height - 30);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const footer = "Need help? Email: support@flightcompany.com";
    doc.text(footer, (doc.internal.pageSize.width - doc.getTextWidth(footer)) / 2, doc.internal.pageSize.height - 10);

    doc.save("ticket.pdf");
  };

  if (!flight) return <p style={{ padding: "2rem" }}>Loading flight details...</p>;

  return (
    <div className="booking-page">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="booking-title"
      >
        Confirm Your Booking
      </motion.h2>

      <div className="flight-card">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          ✈️ {flight.flightNumber || flight.airline}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {flight.fromAirportName} → {flight.toAirportName}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          🕐 {new Date(flight.departureTime).toLocaleTimeString()} - {new Date(flight.arrivalTime).toLocaleTimeString()}
        </motion.p>
        {airplane && (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              🛩️ {airplane.airplaneName}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              📋 Model: {airplane.airplaneModel}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              🏭 Manufacturer: {airplane.manufacturer}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              📦 Capacity: {airplane.capacity}
            </motion.p>
          </>
        )}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          💰 Price: ₹{flight.price}
        </motion.p>
      </div>

      <div className="wallet-info">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Wallet Balance
        </motion.h3>
        <p>{wallet ? `₹${wallet.balance}` : "Loading wallet..."}</p>
      </div>

      <div className="passenger-form">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Passenger Details
        </motion.h3>
        <label>
          Number of Passengers:
          <input
            type="number"
            min="1"
            value={passengerCount}
            onChange={handlePassengerCountChange}
          />
        </label>

        {passengerDetails.map((p, i) => (
          <motion.div
            key={i}
            className="passenger-details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h4>Passenger {i + 1}</h4>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={p.name}
              onChange={(e) => handlePassengerChange(i, e)}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={p.age}
              onChange={(e) => handlePassengerChange(i, e)}
            />
            <select
              name="gender"
              value={p.gender}
              onChange={(e) => handlePassengerChange(i, e)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="booking-actions"
      >
        <button onClick={confirmBooking} disabled={loading}>
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
        {bookingDetails && (
          <>
            <button onClick={generateTicket}>Download Ticket</button>
          </>
        )}
      </motion.div>

      {bookingDetails && (
        <motion.div
          className="confirmation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3>Booking Confirmed!</h3>
          <p>Booking ID: {bookingDetails.bookingId}</p>
          <p>Total: ₹{bookingDetails.totalAmount}</p>
          <p>Time: {new Date(bookingDetails.bookingTime).toLocaleString()}</p>
          <button onClick={generateTicket}>Download Ticket</button>
        </motion.div>
      )}
    </div>
  );
};

export default BookingPage;
