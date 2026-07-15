
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9999/api";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  
});


