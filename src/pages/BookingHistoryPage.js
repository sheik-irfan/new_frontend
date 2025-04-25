import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/BookingHistoryPage.css";
import Sidebar from "../components/Sidebar";
import "../components/Sidebar.css";

const API_URL = "http://localhost:1212/api";

const BookingHistoryPage = ({ token }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [reviews, setReviews] = useState({}); // Stores reviews by flightId
  const [showReviewForm, setShowReviewForm] = useState(null); // Tracks which booking has review form open
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

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

            // Fetch reviews for this flight
            const reviewsRes = await axios.get(`${API_URL}/reviews/flight/${flight.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setReviews(prev => ({ ...prev, [flight.id]: reviewsRes.data }));

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
      const booking = bookings.find((b) => b.bookingId === bookingId);
      const refundAmount = booking?.totalAmount || 0;
 
      await axios.delete(`${API_URL}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
 
      setPopupMessage(`✅ Booking canceled. ₹${refundAmount} has been refunded to your wallet 💰`);
      setShowPopup(true);
      fetchBookings();
    } catch (err) {
      setPopupMessage("❌ Failed to cancel booking");
      setShowPopup(true);
      console.error(err);
    }
  };
  

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const toggleReviewForm = (bookingId) => {
    setShowReviewForm(showReviewForm === bookingId ? null : bookingId);
    setReviewText("");
    setRating(5);
  };

  const submitReview = async (flightId) => {
    try {
      const response = await axios.post(
        `${API_URL}/reviews`,
        {
          flightId,
          rating,
          reviewText
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the reviews for this flight
      const reviewsRes = await axios.get(`${API_URL}/reviews/flight/${flightId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(prev => ({ ...prev, [flightId]: reviewsRes.data }));

      setShowReviewForm(null);
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.message || "Failed to submit review");
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token, sortOrder]);

  return (
    <div className="booking-history-wrapper">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} onLogout={() => {}} />
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

                      {/* Reviews Section */}
                      <div className="reviews-section">
                        <h4>Reviews</h4>
                        {reviews[flight.id]?.length > 0 ? (
                          <div className="reviews-list">
                            {reviews[flight.id].map((review) => (
                              <div key={review.reviewId} className="review-item">
                                <div className="review-rating">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < review.rating ? "star-filled" : "star-empty"}>
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <p className="review-text">{review.reviewText}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>No reviews yet.</p>
                        )}

                        {/* Review Form */}
                        {showReviewForm === booking.bookingId && (
                          <div className="review-form">
                            <h5>Write a Review</h5>
                            <div className="rating-input">
                              <label>Rating:</label>
                              <select value={rating} onChange={(e) => setRating(parseFloat(e.target.value))}>
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <option key={num} value={num}>
                                    {num} star{num !== 1 ? 's' : ''}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <textarea
                              value={reviewText}
                              onChange={(e) => setReviewText(e.target.value)}
                              placeholder="Share your experience..."
                              rows={3}
                            />
                            <div className="review-buttons">
                              <button 
                                className="submit-review-btn"
                                onClick={() => submitReview(flight.id)}
                              >
                                Submit Review
                              </button>
                              <button 
                                className="cancel-review-btn"
                                onClick={() => toggleReviewForm(booking.bookingId)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Add Review Button */}
                        {showReviewForm !== booking.bookingId && (
                          <button 
                            className="add-review-btn"
                            onClick={() => toggleReviewForm(booking.bookingId)}
                          >
                            {reviews[flight.id]?.length > 0 ? 'Add Another Review' : 'Add Review'}
                          </button>
                        )}
                      </div>
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