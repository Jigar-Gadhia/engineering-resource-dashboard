// utils/axios.ts
import axios from "axios";
import { apiUrl } from "./utils";

const api = axios.create({
  baseURL: apiUrl,
});

// Always attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
