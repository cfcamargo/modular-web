import axios from "axios";
import { env } from "@/env";
import { toast } from "sonner";

const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Login expirado, faça login novamente");
      window.location.href = "/sign-in";
    }

    return Promise.reject(error);
  }
);

const baseURL = api.defaults.baseURL;
export { api, baseURL };
