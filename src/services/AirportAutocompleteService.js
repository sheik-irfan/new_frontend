// services/AirportService.js

import axios from "axios";

const API_URL = "http://localhost:1212/api";

// Fetch airports based on the search query
export const fetchAirports = async (query, token) => {
  try {
    const res = await axios.get(`${API_URL}/airports/search?query=${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch airports", err);
    return [];
  }
};
