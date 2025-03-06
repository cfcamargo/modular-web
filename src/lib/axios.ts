import axios from "axios";
import { env } from "@/env";
import { clearLoginInLocalStorage } from "./storage";

const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("modular-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearLoginInLocalStorage();
      window.location.href = "/sign-in";
    }

    return Promise.reject(error);
  }
);

const baseURL = api.defaults.baseURL;
export { api, baseURL };
