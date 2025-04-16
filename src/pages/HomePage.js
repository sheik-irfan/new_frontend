import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate(); // Hook to navigate between pages
  const [search, setSearch] = useState({
    source: "",
    destination: "",
    date: "",
    tripType: "",
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array of background styles for the hero section
  const backgrounds = [
    "bg1", "bg2", "bg3", "bg4", "bg5"
  ];

  // Array of travel quotes
  const quotes = [
    { text: "The world is a book, and those who do not travel read only a page", author: "Saint Augustine" },
    { text: "Travel makes one modest. You see what a tiny place you occupy in the world", author: "Gustave Flaubert" },
    { text: "Life is either a daring adventure or nothing at all", author: "Helen Keller" },
    { text: "We travel not to escape life, but for life not to escape us", author: "Anonymous" },
    { text: "Adventure is worthwhile", author: "Aesop" }
  ];

  // This effect changes the quote displayed every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length); // Cycle through quotes
    }, 5000); // 5 seconds interval
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  // Handle change in search input fields
  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  // Handle the Search button click event
  const handleSearch = () => {
    //  Check if the user is logged in by checking for a token in localStorage or sessionStorage
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      // If no token is found (user is not logged in), navigate to the login page
      navigate("/login");
    } else {
      //  If the user is logged in, navigate to the dashboard with the search data
      navigate("/dashboard", { state: { search } });
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className={`hero-section ${backgrounds[currentIndex]}`}>
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-text-left">
            <h1>Elevate Your</h1>
            <div className="hero-tagline">
              <span>PREMIUM</span>
              <span>EFFICIENT</span>
            </div>
          </div>

          <div className="hero-text-right">
            <h1>Travel Experience</h1>
            <div className="hero-tagline">
              <span>RELIABLE</span>
              <span>SERVICE</span>
            </div>
          </div>
        </div>

        <p className="hero-subtitle">Premium flight bookings with effortless convenience</p>

        <div className="search-form-container">
          <div className="search-box">
            <div className="input-group">
              <input
                type="text"
                name="source"
                placeholder="From"
                value={search.source}
                onChange={handleChange}
              />
              <span className="input-icon">📍</span>
            </div>

            <div className="input-group">
              <input
                type="text"
                name="destination"
                placeholder="To"
                value={search.destination}
                onChange={handleChange}
              />
              <span className="input-icon">✈️</span>
            </div>

            <div className="input-group">
              <input
                type="date"
                name="date"
                value={search.date}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <select
                name="tripType"
                value={search.tripType}
                onChange={handleChange}
              >
                <option value="">Trip Type</option>
                <option value="one-way">One Way</option>
                <option value="round-trip">Round Trip</option>
              </select>
            </div>

            <button onClick={handleSearch}>
              Search Flights <span className="button-icon">🔍</span>
            </button>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>↓ Explore destinations ↓</span>
        </div>
      </div>

      <div className="content-section">
        <div className="quote-container">
          <p className="travel-quote">"{quotes[currentIndex].text}"</p>
          <p className="quote-author">- {quotes[currentIndex].author}</p>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">✈️</div>
            <h3>Global Coverage</h3>
            <p>Access to over 500 destinations worldwide with our extensive airline network</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Premium Service</h3>
            <p>Enjoy luxury travel with our first-class customer experience</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Flexible Options</h3>
            <p>Easy changes and cancellations with transparent policies</p>
          </div>
        </div>

        <div className="airline-partners">
          <h2>Our Trusted Airline Partners</h2>
          <div className="airline-logos">
            <img src="https://logo.clearbit.com/delta.com" alt="Delta" />
            <img src="https://logo.clearbit.com/united.com" alt="United" />
            <img src="https://logo.clearbit.com/aa.com" alt="American Airlines" />
            <img src="https://logo.clearbit.com/emirates.com" alt="Emirates" />
            <img src="https://logo.clearbit.com/lufthansa.com" alt="Lufthansa" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
