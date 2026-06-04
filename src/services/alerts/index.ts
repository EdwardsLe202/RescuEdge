import { API_ENDPOINTS } from "@/constants/api";
import clientRequest from "@/utils/request";
import { IAlertsListParams, IAlertsListResponse } from "@/types/api";

export const getAlertsRequest = async (
  params?: IAlertsListParams
): Promise<IAlertsListResponse> => {
  try {
    const apiUrl = API_ENDPOINTS.ALERTS.LIST;
    const retrieved = await clientRequest.get(apiUrl, { params });
    return retrieved?.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    throw new Error(message);
  }
};
