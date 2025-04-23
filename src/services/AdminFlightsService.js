// services/AdminFlightsService.js

import axios from "axios";

const API_URL = "http://localhost:1212/api";

export const fetchFlights = (token) => {
  return axios.get(`${API_URL}/flights`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchAirports = (token) => {
  return axios.get(`${API_URL}/airports`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchAirplanes = (token) => {
  return axios.get(`${API_URL}/airplanes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addFlight = (token, flight) => {
  return axios.post(`${API_URL}/flights`, flight, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateFlight = (token, flightId, flight) => {
  return axios.put(`${API_URL}/flights/${flightId}`, flight, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteFlight = (token, flightId) => {
  return axios.delete(`${API_URL}/flights/${flightId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
