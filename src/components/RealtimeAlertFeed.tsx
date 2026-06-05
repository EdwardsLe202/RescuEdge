"use client";

import React, { useEffect, useState } from "react";
import { Radio, AlertTriangle, Wifi } from "lucide-react";
import { LiveEvent } from "@/hooks/useWebSocket";
import { useLanguage } from "@/hooks/useLanguage";

interface RealtimeAlertFeedProps {
  events: LiveEvent[];
  isConnected: boolean;
}

export default function RealtimeAlertFeed({ events, isConnected }: RealtimeAlertFeedProps) {
  const { t } = useLanguage();
  const [now, setNow] = useState(() => Date.now());

  // Tick every second so relative timestamps stay fresh
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const relativeTime = (ts: number) => {
    const s = Math.max(0, Math.floor((now - ts) / 1000));
    if (s < 5) return t("justNow");
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    return `${Math.floor(m / 60)}h`;
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mt-0.5">
            <Radio className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              {t("realtimeStreamTitle")}
              <span className="text-[10px] font-bold text-slate-400 font-mono">({events.length})</span>
            </h4>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">{t("realtimeStreamDesc")}</p>
          </div>
        </div>

        {/* Connection status pill */}
        <span
          className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wider border ${
            isConnected
              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
              : "bg-slate-50 border-slate-200 text-slate-400"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
          {isConnected ? t("liveLabel") : t("disconnectedLabel")}
        </span>
      </div>

      {/* Body */}
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <Radio className="w-8 h-8 text-slate-300" />
            {isConnected && (
              <span className="absolute inset-0 -m-1 rounded-full border border-emerald-200 animate-ping" />
            )}
          </div>
          <span className="text-xs font-semibold text-slate-400">{t("waitingForEvents")}</span>
        </div>
      ) : (
        <div className="relative max-h-[360px] overflow-y-auto pr-1">
          {/* Timeline connector line */}
          <div className="absolute left-[15px] top-3 bottom-3 w-px bg-slate-100" />

          <ul className="space-y-1">
            {events.map((ev) => {
              const isAlert = ev.type === "NEW_ALERT";
              const isFresh = now - ev.receivedAt < 6000;
              return (
                <li
                  key={ev.id}
                  className="relative flex items-start gap-3 py-2 pr-1 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  {/* Timeline dot / icon */}
                  <div
                    className={`relative z-10 shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                      isAlert ? "bg-red-100 text-red-500" : "bg-indigo-100 text-indigo-500"
                    }`}
                  >
                    {isAlert ? <AlertTriangle className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 truncate">
                        {isAlert ? t("eventIncident") : t("eventStatusChanged")}
                        {isFresh && (
                          <span className="shrink-0 text-[8px] font-extrabold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md tracking-wider">
                            NEW
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 text-[10px] text-slate-400 font-mono">{relativeTime(ev.receivedAt)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                      <span className="font-mono font-bold text-slate-600 truncate">{ev.deviceId}</span>
                      {isAlert && ev.confidence != null && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="font-bold text-red-500">
                            {Math.round(parseFloat(ev.confidence) * 100)}%
                          </span>
                        </>
                      )}
                      {!isAlert && ev.status && (
                        <>
                          <span className="text-slate-300">→</span>
                          <span
                            className={`font-bold capitalize ${
                              ev.status === "offline" ? "text-red-500" : "text-emerald-600"
                            }`}
                          >
                            {ev.status}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
