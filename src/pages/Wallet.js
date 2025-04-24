import React, { useEffect, useState } from "react";
import {
  fetchWallet,
  addMoneyToWallet,
  isTokenValid,
} from "../services/WalletService";
import Sidebar from "../components/Sidebar"; // Adjust the path as needed
import "../styles/Wallet.css";
import "../components/Sidebar.css"; // Make sure sidebar styles are loaded

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [success, setSuccess] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isTokenValid()) {
      setError("Invalid or missing token.");
      setLoading(false);
      return;
    }

    fetchWallet()
      .then((data) => {
        setWallet(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load wallet.");
        setLoading(false);
      });
  }, []);

  const handleAddMoney = async () => {
    if (!amountToAdd || isNaN(amountToAdd) || parseFloat(amountToAdd) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      const updatedWallet = await addMoneyToWallet(amountToAdd);
      setWallet(updatedWallet);
      setAmountToAdd("");
      setSuccess("✅ Money added successfully!");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to add money.");
      setSuccess("");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loading) return <p className="loading-message">Loading wallet...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="wallet-wrapper">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} onLogout={() => {}} />
      <div className="wallet-main">
        <div className="wallet-card">
          <h2>💼 My Wallet</h2>
          <div className="wallet-info">
            <p><strong>Balance:</strong> {formatCurrency(wallet.balance)}</p>
            <p><strong>Wallet ID:</strong> {wallet.walletId}</p>
            <p><strong>User ID:</strong> {wallet.userId}</p>
          </div>

          <div className="wallet-actions">
            <input
              type="number"
              placeholder="Enter amount to add"
              value={amountToAdd}
              onChange={(e) => setAmountToAdd(e.target.value)}
            />
            <button className="wallet-button" onClick={handleAddMoney}>
              ➕ Add Money
            </button>
            {success && <p className="success-message">{success}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
