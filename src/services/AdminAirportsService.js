// services/AdminAirportsService.js

import axios from "axios";

const API_URL = "http://localhost:1212/api";

export const getAirports = (token) => {
  return axios.get(`${API_URL}/airports`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addAirport = (token, airport) => {
  return axios.post(`${API_URL}/airports`, airport, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateAirport = (token, code, airport) => {
  return axios.put(`${API_URL}/airports/${code}`, airport, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteAirport = (token, code) => {
  return axios.delete(`${API_URL}/airports/${code}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
