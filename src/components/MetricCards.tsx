"use client";

import React from "react";
import { AlertTriangle, Video, Calendar } from "lucide-react";

interface MetricCardsProps {
  alertsCount?: number;
  activeDevicesCount?: number;
  lastAlertTime?: string;
}

export default function MetricCards({
  alertsCount = 0,
  activeDevicesCount = 0,
  lastAlertTime = "No alerts detected",
}: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      {/* Total Alerts Count badge */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100 animate-pulse shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Incidents</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-base font-bold text-red-600">{alertsCount} Alerts</span>
            {alertsCount > 0 && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>}
          </div>
        </div>
      </div>

      {/* Active Devices count */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0">
          <Video className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Active Devices</span>
          <span className="text-sm font-semibold text-gray-800 block mt-0.5">
            {activeDevicesCount} Online
          </span>
        </div>
      </div>

      {/* Event Occurred date */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shrink-0">
          <Calendar className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Last Incident Detected</span>
          <span className="text-xs font-semibold text-gray-800 block mt-1">
            {lastAlertTime}
          </span>
        </div>
      </div>

    </div>
  );
}
