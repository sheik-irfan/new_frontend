// services/AdminService.js
import axios from "axios";

const API_URL = "http://localhost:1212/api";

export const getAirplanes = (token) => {
  return axios.get(`${API_URL}/airplanes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addAirplane = (token, airplane) => {
  return axios.post(`${API_URL}/airplanes`, airplane, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateAirplane = (token, airplane) => {
  return axios.put(`${API_URL}/airplanes/number/${airplane.airplaneNumber}`, airplane, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteAirplane = (token, airplaneNumber) => {
  return axios.delete(`${API_URL}/airplanes/number/${airplaneNumber}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
