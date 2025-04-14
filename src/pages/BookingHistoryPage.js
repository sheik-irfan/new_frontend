// src/pages/BookingHistoryPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/BookingHistoryPage.css";
const API_URL = "http://localhost:1212/api";

const BookingHistoryPage = ({ token, userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/bookings/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let sorted = res.data.sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.bookingDate) - new Date(a.bookingDate)
          : new Date(a.bookingDate) - new Date(b.bookingDate)
      );
      setBookings(sorted);
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
    if (userId && token) {
      fetchBookings();
    }
  }, [userId, token, sortOrder]);

  return (
    <div className="booking-history-wrapper">
      <div className="booking-history-card">
        <h2>Booking History</h2>
        <button className="sort-btn" onClick={toggleSortOrder}>
          Sort by Date ({sortOrder === "desc" ? "Newest" : "Oldest"})
        </button>
        {loading ? (
          <p>Loading...</p>
        ) : bookings.length > 0 ? (
          <ul>
            {bookings.map((booking) => (
              <li key={booking.bookingId}>
                Flight #{booking.flightId} booked on{" "}
                {new Date(booking.bookingDate).toLocaleDateString()}
                <button
                  className="cancel-btn"
                  onClick={() => cancelBooking(booking.bookingId)}
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
