import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { alertsKeys } from "@/queries/alerts";
import { devicesKeys } from "@/queries/devices";

export const useWebSocket = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = session?.idToken;
    const wsUrl = process.env.NEXT_PUBLIC_WS_API_URL;

    if (!token || !wsUrl) return;

    const connectUrl = `${wsUrl}?token=${token}`;
    console.log("Connecting WebSocket to:", wsUrl);
    const ws = new WebSocket(connectUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected successfully");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("WebSocket event message:", message);

        if (message.type === "NEW_ALERT") {
          const payload = message.payload;
          
          // Show toast notification
          toast.warning(
            `🚨 New incident alert on ${payload.deviceId}! Confidence: ${Math.round(
              parseFloat(payload.confidence) * 100
            )}%`
          );
          
          // Invalidate alerts query to refetch new alerts
          queryClient.invalidateQueries({ queryKey: alertsKeys.lists() });
        } else if (message.type === "DEVICE_STATUS_CHANGED") {
          const payload = message.payload;
          
          // Show status info toast
          toast.info(`🔌 Device ${payload.deviceId} status changed to ${payload.status}`);
          
          // Invalidate devices query to refetch updated devices list
          queryClient.invalidateQueries({ queryKey: devicesKeys.lists() });
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.error("WebSocket connection error:", err);
    };

    return () => {
      ws.close();
    };
  }, [session, queryClient]);

  return { isConnected };
};
