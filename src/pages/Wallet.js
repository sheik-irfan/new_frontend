import React, { useEffect, useState } from "react";
import {
  fetchWallet,
  addMoneyToWallet,
  isTokenValid,
} from "../services/WalletService";
 
const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [success, setSuccess] = useState("");
 
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
 
  if (loading) return <p>Loading wallet...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
 
  return (
    <div style={{ padding: "20px" }}>
      <h2>💼 My Wallet</h2>
      <p><strong>Balance:</strong> {formatCurrency(wallet.balance)}</p>
      <p><strong>Wallet ID:</strong> {wallet.walletId}</p>
      <p><strong>User ID:</strong> {wallet.userId}</p>
 
      <div style={{ marginTop: "1rem" }}>
        <input
          type="number"
          placeholder="Enter amount to add"
          value={amountToAdd}
          onChange={(e) => setAmountToAdd(e.target.value)}
          style={{ padding: "8px", marginRight: "10px", width: "200px" }}
        />
        <button onClick={handleAddMoney} style={{ padding: "8px 16px" }}>
          ➕ Add Money
        </button>
        {success && <p style={{ color: "green", marginTop: "10px" }}>{success}</p>}
      </div>
    </div>
  );
};
 
export default Wallet;