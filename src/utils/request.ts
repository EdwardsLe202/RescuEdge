import axios from "axios";
import { getSession } from "next-auth/react";
import { API_BASE_URL } from "@/constants/api";

const clientRequest = axios.create({
  baseURL: API_BASE_URL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60 seconds
});

// Request interceptor to inject Cognito JWT
clientRequest.interceptors.request.use(async (config) => {
  try {
    if (typeof window !== "undefined") {
      const session = await getSession();
      const token = session?.idToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error("Error setting authorization header:", error);
  }
  return config;
});

// Response interceptor to format errors
clientRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returned a custom error message like { error: "..." }
    const serverMessage = error?.response?.data?.error;
    const message = serverMessage || error?.message || "An error occurred";
    return Promise.reject(new Error(message));
  }
);

export default clientRequest;
