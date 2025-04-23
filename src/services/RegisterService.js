// src/services/RegisterService.js
import axios from "axios";
import { buildRegisterPayload } from "../models/RegisterModel";
 
const API_URL = "http://localhost:1212/api";
 
export const registerUser = async (form) => {
  const payload = buildRegisterPayload(form);
  await axios.post(`${API_URL}/register`, payload);
};