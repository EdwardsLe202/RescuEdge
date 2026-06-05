"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Video, AlertTriangle, Calendar } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

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
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      
      {/* Total Alerts Count Metric Card */}
      <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800 tracking-tight">
            {t("totalIncidents")}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold select-none">
            Last 30 Days
          </span>
        </div>
        
        <div className="flex items-center gap-3 mt-3">
          <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
            {alertsCount}
          </span>
          <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-bold flex items-center gap-0.5 ${
            alertsCount > 0 
              ? "bg-red-50 text-red-600 border-red-100" 
              : "bg-emerald-50 text-emerald-600 border-emerald-100"
          }`}>
            {alertsCount > 0 ? (
              <>
                12.5% <ArrowUpRight className="w-3 h-3 shrink-0" />
              </>
            ) : (
              <>
                0.0% <ArrowDownRight className="w-3 h-3 shrink-0" />
              </>
            )}
          </span>
        </div>
        
        <div className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-100 flex items-center gap-1.5 font-medium leading-none select-none">
          <AlertTriangle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>vs. 14 in previous period</span>
        </div>
      </div>

      {/* Active Devices Metric Card */}
      <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800 tracking-tight">
            {t("activeDevices")}
          </span>
          <span className="text-[10px] text-emerald-650 font-semibold select-none">
            Live Monitor
          </span>
        </div>
        
        <div className="flex items-center gap-3 mt-3">
          <span className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
            {activeDevicesCount}
          </span>
          <span className="px-2 py-0.5 rounded-lg border text-[9px] font-bold flex items-center gap-0.5 bg-emerald-50 text-emerald-600 border-emerald-100">
            100% <ArrowUpRight className="w-3 h-3 shrink-0" />
          </span>
        </div>
        
        <div className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-100 flex items-center gap-1.5 font-medium leading-none select-none">
          <Video className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>vs. registered AI nodes</span>
        </div>
      </div>

      {/* Last Incident Metric Card */}
      <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800 tracking-tight">
            {t("lastIncident")}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold select-none">
            Recent Alert
          </span>
        </div>
        
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xl font-bold text-slate-900 truncate tracking-tight max-w-[150px] block font-mono">
            {lastAlertTime.includes(",") ? lastAlertTime.split(",")[0] : lastAlertTime}
          </span>
          <span className="px-2 py-0.5 rounded-lg border text-[9px] font-bold flex items-center gap-0.5 bg-amber-50 text-amber-600 border-amber-100">
            Active
          </span>
        </div>
        
        <div className="text-[11px] text-slate-400 mt-4 pt-2 border-t border-slate-100 flex items-center gap-1.5 font-medium leading-none select-none">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{lastAlertTime}</span>
        </div>
      </div>

    </div>
  );
}
