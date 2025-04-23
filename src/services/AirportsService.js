// src/services/AirportService.js
import axios from "axios";
 
const API_URL = "http://localhost:1212/api";
 
export const fetchAllAirports = async (token) => {
  const res = await axios.get(`${API_URL}/airports`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
 