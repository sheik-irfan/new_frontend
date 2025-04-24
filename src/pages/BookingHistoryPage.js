import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/BookingHistoryPage.css";
import Sidebar from "../components/Sidebar"; // Adjust path as needed
import "../components/Sidebar.css"; // Ensure sidebar styles are available

const API_URL = "http://localhost:1212/api";

const BookingHistoryPage = ({ token }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/bookings/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedBookings = res.data.sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.bookingTime) - new Date(a.bookingTime)
          : new Date(a.bookingTime) - new Date(b.bookingTime)
      );

      const bookingsWithDetails = await Promise.all(
        sortedBookings.map(async (booking) => {
          try {
            const flightRes = await axios.get(`${API_URL}/flights/${booking.flightId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const flight = flightRes.data;

            let airplane = null;
            try {
              const airplaneRes = await axios.get(`${API_URL}/airplanes/${flight.airplaneId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              airplane = airplaneRes.data;
            } catch (airErr) {
              console.warn("No airplane found for flight:", airErr);
            }

            return { ...booking, flight, airplane };
          } catch (error) {
            console.error("Error fetching flight/airplane info:", error);
            return { ...booking, flight: null, airplane: null };
          }
        })
      );

      setBookings(bookingsWithDetails);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await axios.delete(`${API_URL}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Booking canceled.");
      fetchBookings();
    } catch (err) {
      alert("Failed to cancel booking");
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token, sortOrder]);

  return (
    <div className="booking-history-wrapper">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} onLogout={() => {}} /> {/* or remove if not needed */}
      <div className="booking-history-card">
        <h2>Booking History</h2>
        <button className="sort-btn" onClick={toggleSortOrder}>
          Sort by Date ({sortOrder === "desc" ? "Newest" : "Oldest"})
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length > 0 ? (
          <ul>
            {bookings.map((booking) => {
              const { flight, airplane } = booking;

              return (
                <div className="booking-card" key={booking.bookingId}>
                {flight ? (
                  <>
                    <h3>✈️ {flight.flightNumber || flight.airline}</h3>
                    <p>{flight.fromAirportName} → {flight.toAirportName}</p>
                    <p>
                      📅 {new Date(flight.departureTime).toLocaleDateString()} | 🕐{" "}
                      {new Date(flight.departureTime).toLocaleTimeString()} -{" "}
                      {new Date(flight.arrivalTime).toLocaleTimeString()}
                    </p>
                    <p>💺 Airplane ID: {flight.airplaneId}</p>
                    {airplane && <p>🛫 Airplane Model: {airplane.airplaneModel}</p>}
                    <p>💰 Price: ₹{booking.totalAmount}</p>
                    <p>🧾 Booking ID: {booking.bookingId}</p>
                    <p>📅 Booked on: {new Date(booking.bookingTime).toLocaleString()}</p>
                  </>
                ) : (
                  <p>❌ Flight details unavailable</p>
                )}
                <button className="cancel-btn" onClick={() => cancelBooking(booking.bookingId)}>
                  Cancel
                </button>
              </div>
              
              );
            })}
          </ul>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
