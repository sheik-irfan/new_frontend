// src/services/WalletService.js
 
import { createWalletModel } from "../models/WalletModel";
import { jwtDecode } from "jwt-decode";
 
const API_URL = "http://localhost:1212/api";
 
const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};
 
export const fetchWallet = async () => {
  const res = await fetch(`${API_URL}/wallet`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
 
  if (!res.ok) {
    throw new Error("Failed to fetch wallet.");
  }
 
  const data = await res.json();
  return createWalletModel(data);
};
 
export const addMoneyToWallet = async (amount) => {
  const res = await fetch(`${API_URL}/wallet/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ balance: parseFloat(amount) }),
  });
 
  if (!res.ok) {
    throw new Error("Failed to add money to wallet.");
  }
 
  const data = await res.json();
  return createWalletModel(data);
};
 
export const isTokenValid = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  try {
    jwtDecode(token);
    return true;
  } catch {
    return false;
  }
};