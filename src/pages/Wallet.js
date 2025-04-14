// src/pages/Wallet.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Wallet.css";

const API_URL = "http://localhost:1212/api";

const Wallet = ({ token, userId }) => {
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
      console.error("Error loading wallet:", err);
      setMessage("❌ Could not fetch wallet.");
    }
  };

  const topUpWallet = async () => {
    try {
      await axios.post(
        `${API_URL}/wallets/topup`,
        { userId, amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("✅ Wallet topped up!");
      fetchWallet();
    } catch (err) {
      console.error("Top-up failed:", err);
      setMessage("❌ Top-up failed.");
    }
  };

  useEffect(() => {
    if (token && userId) {
      fetchWallet();
    }
  }, [token, userId]);

  return (
    <div className="wallet-container">
      <h2>💰 Your Wallet</h2>
      {wallet ? (
        <>
          <p>Current Balance: ₹{wallet.balance.toLocaleString()}</p>
          <div className="top-up-section">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={100}
              step={100}
            />
            <button onClick={topUpWallet}>Top Up</button>
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
