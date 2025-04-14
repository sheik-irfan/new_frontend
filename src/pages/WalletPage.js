// src/pages/WalletPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/WalletPage.css";

const API_URL = "http://localhost:1212/api";

const WalletPage = ({ token, userId }) => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/wallets/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWallet(res.data);
    } catch (err) {
      console.error("Failed to fetch wallet", err);
    } finally {
      setLoading(false);
    }
  };

  const topUpWallet = async (amount) => {
    try {
      await axios.post(
        `${API_URL}/wallets/topup`,
        { userId, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWallet();
      alert("Wallet topped up successfully!");
    } catch (err) {
      alert("Top-up failed");
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchWallet();
    }
  }, [userId, token]);

  return (
    <div className="wallet-wrapper">
      <div className="wallet-card">
        <h2>Your Wallet</h2>
        {loading ? (
          <p>Loading...</p>
        ) : wallet ? (
          <p className="wallet-balance">Balance: ₹{wallet.balance}</p>
        ) : (
          <p>Wallet not found</p>
        )}
        <button onClick={() => topUpWallet(500)}>
          Top Up ₹500
        </button>
        <button onClick={() => topUpWallet(1000)}>
          Top Up ₹1000
        </button>
      </div>
    </div>
  );
};

export default WalletPage;
