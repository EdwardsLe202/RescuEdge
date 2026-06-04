export const API_BASE_URL = typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_BASE_URL || "");

if (!API_BASE_URL && typeof window === "undefined") {
  console.warn("⚠️ NEXT_PUBLIC_API_BASE_URL is not set!");
}

export const API_ENDPOINTS = {
  ALERTS: {
    LIST: "/api/v1/alerts",
  },
  DEVICES: {
    LIST: "/api/v1/devices",
    UPDATE: (deviceId: string) => `/api/v1/devices/${deviceId}`,
  },
  VIDEO: {
    STREAM_URL: (deviceId: string) => `/api/v1/video/stream-url/${deviceId}`,
  },
} as const;
