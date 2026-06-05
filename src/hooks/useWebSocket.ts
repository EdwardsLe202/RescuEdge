import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { alertsKeys } from "@/queries/alerts";
import { devicesKeys } from "@/queries/devices";

export interface LiveEvent {
  id: string;
  type: "NEW_ALERT" | "DEVICE_STATUS_CHANGED";
  deviceId: string;
  confidence?: string;
  status?: string;
  receivedAt: number;
}

const MAX_LIVE_EVENTS = 25;

export const useWebSocket = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  const pushEvent = (event: Omit<LiveEvent, "id" | "receivedAt">) => {
    setLiveEvents((prev) =>
      [
        { ...event, id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, receivedAt: Date.now() },
        ...prev,
      ].slice(0, MAX_LIVE_EVENTS)
    );
  };

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

          // Record in the live stream
          pushEvent({
            type: "NEW_ALERT",
            deviceId: payload.deviceId,
            confidence: payload.confidence,
          });

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

          // Record in the live stream
          pushEvent({
            type: "DEVICE_STATUS_CHANGED",
            deviceId: payload.deviceId,
            status: payload.status,
          });

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

  return { isConnected, liveEvents };
};
