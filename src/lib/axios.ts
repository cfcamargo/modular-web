import axios from "axios";
import { env } from "@/env";
import { toast } from "sonner";

const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true, // cookies HttpOnly vão junto
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (error.config?.url?.includes("/auth/login")) {
        return Promise.reject(error);
      }

      toast.error("Sua sessão expirou. Faça login novamente.");
      window.location.href = "/sign-in";
    }

    return Promise.reject(error);
  }
);

const baseURL = api.defaults.baseURL;
export { api, baseURL };
