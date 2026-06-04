import { API_ENDPOINTS } from "@/constants/api";
import clientRequest from "@/utils/request";
import { IGetVideoStreamUrlResponse } from "@/types/api";

export const getVideoStreamUrlRequest = async (
  deviceId: string
): Promise<IGetVideoStreamUrlResponse> => {
  try {
    const apiUrl = API_ENDPOINTS.VIDEO.STREAM_URL(deviceId);
    const retrieved = await clientRequest.get(apiUrl);
    return retrieved?.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    throw new Error(message);
  }
};
