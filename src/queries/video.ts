import { getVideoStreamUrlRequest } from "@/services/video";
import { useQuery } from "@tanstack/react-query";

export const videoKeys = {
  all: ["video"] as const,
  streams: () => [...videoKeys.all, "stream"] as const,
  stream: (deviceId: string) => [...videoKeys.streams(), deviceId] as const,
};

export const useVideoStreamUrl = (deviceId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: videoKeys.stream(deviceId),
    queryFn: () => getVideoStreamUrlRequest(deviceId),
    enabled: enabled && !!deviceId,
    staleTime: 55 * 60 * 1000, // 55 minutes (presigned URL expires in 60 minutes/3600s)
    gcTime: 60 * 60 * 1000, // 60 minutes
  });
};
