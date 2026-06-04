import { API_ENDPOINTS } from "@/constants/api";
import clientRequest from "@/utils/request";
import {
  IDevicesListParams,
  IDevicesListResponse,
  IUpdateDeviceDesiredStateRequest,
  IUpdateDeviceDesiredStateResponse,
} from "@/types/api";

export const getDevicesRequest = async (
  params?: IDevicesListParams
): Promise<IDevicesListResponse> => {
  try {
    const apiUrl = API_ENDPOINTS.DEVICES.LIST;
    const retrieved = await clientRequest.get(apiUrl, { params });
    return retrieved?.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    throw new Error(message);
  }
};

export const updateDeviceDesiredStateRequest = async (
  deviceId: string,
  data: IUpdateDeviceDesiredStateRequest
): Promise<IUpdateDeviceDesiredStateResponse> => {
  try {
    const apiUrl = API_ENDPOINTS.DEVICES.UPDATE(deviceId);
    const retrieved = await clientRequest.patch(apiUrl, data);
    return retrieved?.data;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    throw new Error(message);
  }
};
