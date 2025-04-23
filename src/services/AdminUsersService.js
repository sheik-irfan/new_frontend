// services/AdminUsersService.js

import axios from "axios";

const API_URL = "http://localhost:1212/api";

export const fetchUsers = (token) => {
  return axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
