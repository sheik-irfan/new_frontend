// src/services/flightService.js

import axios from "axios";
import Flight from "../models/FlightsModel";

const API_URL = "http://localhost:1212/api/flights";

export const getAllFlights = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.map(flightData => new Flight(flightData));
};
