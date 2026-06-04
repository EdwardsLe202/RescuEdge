"use client";

import React from "react";
import { IAlert } from "@/types/api";
import { AlertTriangle, Clock, ShieldAlert } from "lucide-react";

interface AlertsFeedProps {
  alerts: IAlert[];
  isLoading: boolean;
}

export default function AlertsFeed({ alerts, isLoading }: AlertsFeedProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-lg flex flex-col mb-6 min-h-[200px] justify-center items-center">
        <span className="text-sm text-gray-400 font-medium animate-pulse">Loading Alerts Feed...</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-lg flex flex-col mb-6">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
        <ShieldAlert className="w-5 h-5 text-red-500" />
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Real-time Alerts Feed ({alerts.length})
        </h3>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <AlertTriangle className="w-8 h-8 text-gray-300 mb-2" />
          <span className="text-xs font-semibold">No incidents detected for this device</span>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {alerts.map((alert) => (
            <div
              key={alert.alertId}
              className="flex items-start gap-4 p-3 bg-red-50/20 hover:bg-red-50/40 border border-red-100/50 rounded-2xl transition-all shadow-sm"
            >
              {/* Alert Snapshot image */}
              {alert.snapshotUrl ? (
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-900 border border-gray-200/50 shrink-0 relative group">
                  <img
                    src={alert.snapshotUrl}
                    alt="Alert Snapshot"
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gray-100 border border-gray-200/50 shrink-0 flex items-center justify-center text-gray-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              )}

              {/* Alert Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Incident detected
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Device ID</span>
                    <span className="text-xs font-bold text-gray-800 font-mono truncate block">{alert.deviceId}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Confidence</span>
                    <span className="text-xs font-bold text-gray-800 block">
                      {Math.round(parseFloat(alert.confidence) * 100)}%
                    </span>
                  </div>
                  {alert.distance && (
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Distance</span>
                      <span className="text-xs font-bold text-gray-800 block">{alert.distance}m</span>
                    </div>
                  )}
                  {alert.inferenceMs && (
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Inference</span>
                      <span className="text-xs font-bold text-gray-800 block">{alert.inferenceMs} ms</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
