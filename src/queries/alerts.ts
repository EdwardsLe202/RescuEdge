import { getAlertsRequest } from "@/services/alerts";
import { useQuery } from "@tanstack/react-query";
import { IAlertsListParams } from "@/types/api";

export const alertsKeys = {
  all: ["alerts"] as const,
  lists: () => [...alertsKeys.all, "list"] as const,
  list: (params?: IAlertsListParams) => [...alertsKeys.lists(), params] as const,
};

export const useAlerts = (params?: IAlertsListParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: alertsKeys.list(params),
    queryFn: () => getAlertsRequest(params),
    enabled: enabled,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
