import React from "react";
import "../styles/AboutUs.css";
import { useNavigate } from "react-router-dom";

function AboutUs() {
  const navigate = useNavigate();

  const handleBookFlight = () => {
    navigate("/");
  };
  return (
    <div className="about">
      <header className="about-header">
        <h1>About FlyFast</h1>
        <p className="tagline">Where Speed Meets Comfort in Air Travel</p>
        <div className="header-image"></div>
      </header>

      <section className="about-content">
        <article className="card">
          <div className="card-icon">✈️</div>
          <h2>Our Story</h2>
          <p>
            Founded in 2024, FlyFast emerged from a simple idea: air travel should be effortless. 
            Our team of aviation experts and tech enthusiasts came together to build the most intuitive 
            flight booking platform that eliminates the stress of travel planning. Today, we serve over 
            1 million customers annually across 50+ countries.
          </p>
        </article>

        <article className="card">
          <div className="card-icon">🌎</div>
          <h2>Global Reach</h2>
          <p>
            We partner with 80+ airlines worldwide, offering access to over 2,000 destinations. 
            From budget carriers to luxury airlines, FlyFast provides options for every traveler's 
            needs and budget. Our smart search technology compares millions of flight options in 
            seconds to find you the perfect itinerary.
          </p>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">4M+</span>
              <span className="stat-label">Tickets Booked</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">93%</span>
              <span className="stat-label">Customer Satisfaction</span>
            </div>
          </div>
        </article>

        <article className="card">
          <div className="card-icon">💡</div>
          <h2>Innovation at Core</h2>
          <p>
            FlyFast leverages cutting-edge technology to enhance your travel experience:
          </p>
          <ul>
            <li><strong>AI-Powered Search:</strong> Our algorithms learn your preferences to suggest ideal flights</li>
            <li><strong>Fare Prediction:</strong> Get alerts when prices are likely to drop</li>
            <li><strong>Virtual Assistant:</strong> 24/7 chatbot support for instant help</li>
            <li><strong>Seat Alert:</strong> Notifications when preferred seats become available</li>
          </ul>
        </article>
      </section>

      <section className="team-section">
        <h2>The FlyFast Difference</h2>
        <div className="team-grid">
          <div className="team-item">
            <div className="team-icon">🚀</div>
            <h3>Lightning Fast</h3>
            <p>Average booking time under 90 seconds</p>
          </div>
          <div className="team-item">
            <div className="team-icon">🔒</div>
            <h3>Secure Payments</h3>
            <p>Bank-level encryption for all transactions</p>
          </div>
          <div className="team-item">
            <div className="team-icon">🧳</div>
            <h3>Travel Tools</h3>
            <p>Free seat alerts, baggage calculators & more</p>
          </div>
          <div className="team-item">
            <div className="team-icon">🌱</div>
            <h3>Eco-Conscious</h3>
            <p>Carbon offset options with every booking</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready for Takeoff?</h2>
        <p>
          Join millions of travelers who trust FlyFast for their journeys. 
          Experience the future of flight booking today.
        </p>
        <div className="cta-buttons">
          <button 
            className="cta-button primary" 
            onClick={handleBookFlight}
          >
            Book Your Flight
          </button>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;