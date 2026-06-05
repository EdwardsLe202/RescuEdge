"use client";

import React from "react";
import { IAlert } from "@/types/api";
import { AlertTriangle, Clock, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface AlertsFeedProps {
  alerts: IAlert[];
  isLoading: boolean;
}

export default function AlertsFeed({ alerts, isLoading }: AlertsFeedProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col mb-6 min-h-[200px] justify-center items-center">
        <span className="text-sm text-gray-400 font-medium animate-pulse">{t("loadingAlertsFeed")}</span>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col mb-6">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3 select-none">
        <ShieldAlert className="w-4 h-4 text-red-500" />
        <h3 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
          {t("aiAlertsFeed")} ({alerts.length})
        </h3>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <AlertTriangle className="w-8 h-8 text-gray-300 mb-2" />
          <span className="text-xs font-semibold">{t("noIncidentsDetected")}</span>
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
                    {t("incidentDetected")}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">{t("deviceIdLabel")}</span>
                    <span className="text-xs font-bold text-gray-800 font-mono truncate block">{alert.deviceId}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">{t("confidence")}</span>
                    <span className="text-xs font-bold text-gray-800 block">
                      {Math.round(parseFloat(alert.confidence) * 100)}%
                    </span>
                  </div>
                  {alert.distance && (
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">{t("distanceCol")}</span>
                      <span className="text-xs font-bold text-gray-800 block">{alert.distance}m</span>
                    </div>
                  )}
                  {alert.inferenceMs && (
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">{t("inferenceCol")}</span>
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
