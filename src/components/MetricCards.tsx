"use client";

import React from "react";
import { AlertTriangle, HelpCircle, Calendar } from "lucide-react";

export default function MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      
      {/* Severity Rate badge */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100 animate-pulse shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">SEVERITY RATE</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-base font-bold text-red-600">Critical / High</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
          </div>
        </div>
      </div>

      {/* Query Raised date */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">QUERY RAISED</span>
          <span className="text-sm font-semibold text-gray-800 block mt-0.5">Nov 23, 2024 12:00 PM</span>
        </div>
      </div>

      {/* Event Occurred date */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shrink-0">
          <Calendar className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">EVENT OCCURRED</span>
          <span className="text-sm font-semibold text-gray-800 block mt-0.5">Nov 20, 2024 10:30 PM</span>
        </div>
      </div>

    </div>
  );
}
