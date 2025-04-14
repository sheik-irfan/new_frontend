// src/pages/Wallet.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Wallet.css";

const API_URL = "http://localhost:1212/api";

const Wallet = ({ token, userId, userRole }) => {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState(1000);
  const [message, setMessage] = useState("");

  const fetchWallet = async () => {
    try {
      const res = await axios.get(`${API_URL}/wallets/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWallet(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        try {
          await axios.post(`${API_URL}/wallets/create?userId=${userId}`, null, {
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchWallet(); // Retry fetch
        } catch (creationErr) {
          console.error("Wallet creation failed:", creationErr);
          setMessage("❌ Failed to create wallet.");
        }
      } else {
        console.error("Error loading wallet:", err);
        setMessage("❌ Could not fetch wallet.");
      }
    }
  };

  const topUpWallet = async () => {
    try {
      await axios.post(
        `${API_URL}/wallets/add`,
        { userId, amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("✅ Wallet topped up!");
      fetchWallet(); // Refresh balance
    } catch (err) {
      console.error("Top-up failed:", err);
      setMessage("❌ Top-up failed.");
    }
  };

  useEffect(() => {
    if (token && userId && userRole === "CUSTOMER") {
      fetchWallet();
    }
  }, [token, userId, userRole]);

  if (userRole !== "CUSTOMER") {
    return <p className="wallet-message">❌ Wallet is only available for customers.</p>;
  }

  return (
    <div className="wallet-container">
      <h2>💰 Your Wallet</h2>
      {wallet ? (
        <>
          <p>Current Balance: ₹{wallet.balance.toLocaleString()}</p>
          <div className="top-up-section">
            <label htmlFor="top-up-amount">Top-Up Amount (₹):</label>
            <div className="top-up-input-group">
              <input
                id="top-up-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={100}
                step={100}
              />
              <button onClick={topUpWallet}>Top Up</button>
              <button onClick={fetchWallet} className="refresh-btn">🔄</button>
            </div>
          </div>
        </>
      ) : (
        <p>Loading wallet...</p>
      )}
      {message && <p className="wallet-message">{message}</p>}
    </div>
  );
};

export default Wallet;
