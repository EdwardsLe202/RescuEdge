import {
  getDevicesRequest,
  updateDeviceDesiredStateRequest,
} from "@/services/devices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IDevicesListParams, IUpdateDeviceDesiredStateRequest } from "@/types/api";

export const devicesKeys = {
  all: ["devices"] as const,
  lists: () => [...devicesKeys.all, "list"] as const,
  list: (params?: IDevicesListParams) => [...devicesKeys.lists(), params] as const,
};

export const useDevices = (params?: IDevicesListParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: devicesKeys.list(params),
    queryFn: () => getDevicesRequest(params),
    enabled: enabled,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateDeviceDesiredState = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      deviceId,
      data,
    }: {
      deviceId: string;
      data: IUpdateDeviceDesiredStateRequest;
    }) => updateDeviceDesiredStateRequest(deviceId, data),
    onSuccess: () => {
      // Invalidate all device list queries
      queryClient.invalidateQueries({ queryKey: devicesKeys.lists() });
    },
  });
};
