import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [amountToAdd, setAmountToAdd] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadWallet();
  }, []);

  const loadWallet = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    try {
      jwtDecode(token); // Just to validate token, no need to extract userId
    } catch (err) {
      console.error("JWT decode error:", err);
      setError("Invalid token.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:1212/api/wallet", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load wallet: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setWallet(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Wallet fetch error:", err);
        setError("Could not load wallet.");
        setLoading(false);
      });
  };

  const handleAddMoney = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token || !amountToAdd || isNaN(amountToAdd) || parseFloat(amountToAdd) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      const res = await fetch("http://localhost:1212/api/wallet/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ balance: parseFloat(amountToAdd) }),
      });

      if (!res.ok) {
        throw new Error(`Failed to add money: ${res.status}`);
      }

      const updatedWallet = await res.json();
      setWallet(updatedWallet);
      setAmountToAdd("");
      setSuccess("✅ Money added successfully!");
      setError("");
    } catch (err) {
      console.error("Add money error:", err);
      setError("Failed to add money to wallet.");
      setSuccess("");
    }
  };

  // Format balance as Rupees (₹)
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
