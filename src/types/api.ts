// API Types matching backend contracts defined in API.md

// ==========================================
// Alerts API Types
// ==========================================

export interface IAlert {
  alertId: string;
  deviceId: string;
  timestamp: string;
  distance: string;
  confidence: string;
  inferenceMs: number;
  snapshotKey: string;
  snapshotUrl: string;
}

export interface IAlertsListParams {
  deviceId?: string;
  limit?: number;
}

export interface IAlertsListResponse {
  alerts: IAlert[];
  count: number;
}

// ==========================================
// Devices API Types
// ==========================================

export interface IDevice {
  deviceId: string;
  status: string;
  battery: number;
  signalStrength: number;
  lastSeen: string;
}

export interface IDevicesListParams {
  status?: string;
}

export interface IDevicesListResponse {
  devices: IDevice[];
}

export interface IUpdateDeviceDesiredStateRequest {
  mode?: "live" | "offline" | string;
  cameraEnabled?: boolean;
  alertThreshold?: number;
}

export interface IUpdateDeviceDesiredStateResponse {
  deviceId: string;
  desired: {
    mode?: string;
    cameraEnabled?: boolean;
    alertThreshold?: number;
  };
}

// ==========================================
// Video API Types
// ==========================================

export interface IVideoClip {
  videoKey: string;
  streamUrl: string;
  contentType: string;
  lastModified: string;
  size: number;
  expiresIn: number;
}

export interface IGetVideoStreamUrlResponse {
  deviceId: string;
  videos: IVideoClip[];
  count: number;
}
