import axios, { AxiosError } from "axios";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined");
}

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      // For client-side requests, we'll handle authentication differently
      // The session will be automatically included via cookies for same-origin requests
      // For API routes that need explicit token passing, implement client-side token retrieval
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default api;
