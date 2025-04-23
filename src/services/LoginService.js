// src/services/LoginService.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createUserFromToken } from "../models/LoginModel";
 
const API_URL = "http://localhost:1212/api";
 
export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, {
    userEmail: email,
    userPassword: password,
  });
 
  const { token, role, id } = res.data;
  const decoded = jwtDecode(token);
  const user = createUserFromToken(decoded, email, role, id);
 
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
 
  return { token, user };
};