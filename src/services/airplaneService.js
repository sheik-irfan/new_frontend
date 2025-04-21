import axios from "axios";

const API_URL = "http://localhost:1212/api";

export const fetchAirplanes = async (token) => {
  try {
    const res = await axios.get(`${API_URL}/airplanes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching airplanes:", err);
    throw err;
  }
};
