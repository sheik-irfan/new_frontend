import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/BookingHistoryPage.css";

const API_URL = "http://localhost:1212/api";

const BookingHistoryPage = ({ token }) => {
  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState({});
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");

  // Fetch bookings and flight details
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/bookings/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let sorted = res.data.sort((a, b) =>
        sortOrder === "desc"
          ? new Date(b.bookingTime) - new Date(a.bookingTime)
          : new Date(a.bookingTime) - new Date(b.bookingTime)
      );

      setBookings(sorted);

      // Fetch flight details for each booking
      const flightIds = sorted.map((booking) => booking.flightId);
      const flightPromises = flightIds.map((flightId) =>
        axios.get(`${API_URL}/flights/${flightId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const flightResponses = await Promise.all(flightPromises);
      const flightData = flightResponses.reduce((acc, response) => {
        acc[response.data.flightId] = response.data;
        return acc;
      }, {});

      setFlights(flightData);
    } catch (err) {
      console.error("Failed to fetch bookings or flights", err);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleString(); // Format the date in a user-friendly format
  };

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
            {bookings.map((booking) => {
              const flight = flights[booking.flightId]; // Get flight details by flightId
              return (
                <li key={booking.bookingId}>
                  <h3>Flight #{flight?.flightNumber || "N/A"}</h3>
                  <p><strong>Source:</strong> {flight?.source || "N/A"}</p>
                  <p><strong>Destination:</strong> {flight?.destination || "N/A"}</p>
                  <p>
                    <strong>Departure:</strong> {flight?.departureDate ? formatDate(flight?.departureDate) : "N/A"}
                  </p>
                  <p>💸 Amount: ₹{booking.totalAmount}</p>
                  <p>🧾 Booking ID: {booking.bookingId}</p>
                  <p>📅 Booked on: {formatDate(booking.bookingTime)}</p>
                  <button
                    className="cancel-btn"
                    onClick={() => cancelBooking(booking.bookingId)}
                  >
                    Cancel
                  </button>
                </li>
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
