import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/BookingPage.css";
import { jsPDF } from "jspdf"; // Use jsPDF library to generate tickets

const API_URL = "http://localhost:1212/api";

const BookingPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [airplane, setAirplane] = useState(null);
  const [passengerCount, setPassengerCount] = useState(1); // Track number of passengers
  const [passengerDetails, setPassengerDetails] = useState([{ name: "", age: "", gender: "" }]); // Store passenger details
  
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
      console.error("Failed to fetch flight details", err);
      alert("Flight not found.");
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
      console.error("Failed to fetch wallet", err);
    }
  };

  const fetchAirplaneDetails = async (airplaneId) => {
    try {
      const res = await axios.get(`${API_URL}/airplanes/${airplaneId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAirplane(res.data);
    } catch (err) {
      console.error("Failed to fetch airplane details", err);
    }
  };

  const handlePassengerChange = (index, event) => {
    const values = [...passengerDetails];
    values[index][event.target.name] = event.target.value;
    setPassengerDetails(values);
  };

  const handlePassengerCountChange = (event) => {
    let count = parseInt(event.target.value);

    // Ensure that the count cannot go below 1
    if (count < 1) count = 1;

    setPassengerCount(count);

    setPassengerDetails((prevDetails) => {
      const newDetails = [...prevDetails];

      // If the new count is greater than the current length, add more passengers
      if (count > newDetails.length) {
        // Add new passenger details as empty objects
        for (let i = newDetails.length; i < count; i++) {
          newDetails.push({ name: "", age: "", gender: "" });
        }
      } else {
        // If the new count is less, remove passengers
        newDetails.splice(count);  // Remove passengers to match the new count
      }

      return newDetails;
    });
  };

  const validatePassengerDetails = () => {
    for (let passenger of passengerDetails) {
      if (!passenger.name || !passenger.age || !passenger.gender) {
        return false;
      }
    }
    return true;
  };

  const confirmBooking = async () => {
    if (!wallet || wallet.balance < flight.price * passengerCount) {
      alert("Insufficient balance. Please top up your wallet.");
      return;
    }

    if (!validatePassengerDetails()) {
      alert("Please complete all passenger details.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/bookings`,
        { flightId: flight.id, passengers: passengerDetails },
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

  const generateTicket = () => {
    const doc = new jsPDF();
  
    // Title - centered at the top
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Confirmation", doc.internal.pageSize.width / 2, 20, { align: 'center' });
  
    // Flight and passenger details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
  
    // Flight Information
    doc.text(`Flight: ${flight.flightNumber || flight.airline}`, 20, 40);
    doc.text(`From: ${flight.fromAirportName}`, 20, 50);
    doc.text(`To: ${flight.toAirportName}`, 20, 60);
    doc.text(`Departure: ${new Date(flight.departureTime).toLocaleString()}`, 20, 70);
    doc.text(`Arrival: ${new Date(flight.arrivalTime).toLocaleString()}`, 20, 80);
    doc.text(`Price: ₹${flight.price}`, 20, 90);
  
    // Passenger Details
    passengerDetails.forEach((passenger, index) => {
      const yOffset = 100 + (index * 40);
      doc.text(`Passenger ${index + 1}:`, 20, yOffset);
      doc.text(`Name: ${passenger.name}`, 20, yOffset + 10);
      doc.text(`Age: ${passenger.age}`, 20, yOffset + 20);
      doc.text(`Gender: ${passenger.gender}`, 20, yOffset + 30);
    });
  
    // Thank you message at the bottom
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const message = "Thank you for booking with us! We wish you a pleasant flight!";
    const messageWidth = doc.getTextWidth(message);
    doc.text(message, (doc.internal.pageSize.width - messageWidth) / 2, doc.internal.pageSize.height - 30);
  
    // Footer at the bottom of the page
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const footerText = "For inquiries, contact us at support@flightcompany.com";
    doc.text(footerText, doc.internal.pageSize.width / 2 - doc.getTextWidth(footerText) / 2, doc.internal.pageSize.height - 10);
  
    // Save PDF
    doc.save("ticket.pdf");
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
          <>
            <p>🛩️ Airplane Name: {airplane.airplaneName}</p>
            <p>📋 Model: {airplane.airplaneModel}</p>
            <p>🏭 Manufacturer: {airplane.manufacturer}</p>
            <p>📦 Capacity: {airplane.capacity}</p>
          </>
        )}
        <p>💰 Price: ₹{flight.price}</p>
      </div>

      <div className="wallet-info">
        <h3>Wallet Balance</h3>
        {wallet ? <p>₹{wallet.balance}</p> : <p>Loading wallet...</p>}
      </div>

      <div className="passenger-form">
        <h3>Enter Passenger Details</h3>
        <div className="passenger-count">
          <label>Number of Passengers:</label>
          <input
            type="number"
            min="1"
            value={passengerCount}
            onChange={handlePassengerCountChange}
          />
        </div>

        {Array.from({ length: passengerCount }).map((_, index) => (
          <div className="passenger-details" key={index}>
            <h4>Passenger {index + 1}</h4>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={passengerDetails[index]?.name || ""}
              onChange={(e) => handlePassengerChange(index, e)}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={passengerDetails[index]?.age || ""}
              onChange={(e) => handlePassengerChange(index, e)}
            />
            <select
              name="gender"
              value={passengerDetails[index]?.gender || ""}
              onChange={(e) => handlePassengerChange(index, e)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        ))}
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
          <button className="download-ticket-btn" onClick={generateTicket}>
            📥 Download Ticket
          </button>
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
