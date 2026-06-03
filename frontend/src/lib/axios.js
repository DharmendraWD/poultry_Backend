


import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
//   withCredentials: true,
// });
const api = axios.create({
  baseURL: '/api/proxy',  // ← same domain as frontend, no more cross-site
  withCredentials: true,
});

// Attach token automatically (ONLY if exists)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
