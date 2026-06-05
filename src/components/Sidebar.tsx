"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Video,
  AlertTriangle,
  Settings,
  LogOut,
  Send,
} from "lucide-react";
import { IDevice } from "@/types/api";
import { useLanguage } from "@/hooks/useLanguage";

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  devices: IDevice[];
  selectedDeviceId: string;
  setSelectedDeviceId: (id: string) => void;
}

export default function Sidebar({
  activeMenu,
  setActiveMenu,
  devices = [],
  selectedDeviceId,
  setSelectedDeviceId,
}: SidebarProps) {
  const { data: session } = useSession();
  const { t } = useLanguage();

  // Get user name and dynamic avatar initials
  const userName = session?.user?.name;
  const userEmail = session?.user?.email;
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "";

  return (
    <aside className="w-64 border-r border-slate-200 flex flex-col justify-between bg-[#f8fafc] hidden lg:flex shrink-0 z-30 select-none">
      {/* Upper menu navigation elements */}
      <div className="p-4 space-y-6 overflow-y-auto">
        
        {/* Menu Section */}
        <div className="space-y-1">
          <div className="px-3 mb-2 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">
            General
          </div>
          {[
            { id: "dashboard", label: t("dashboard"), icon: LayoutDashboard },
            { id: "recordings", label: t("recordings"), icon: Video },
            { id: "alerts", label: t("alerts"), icon: AlertTriangle },
            { id: "dispatch", label: t("sendUnits"), icon: Send },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer group focus:outline-none border ${
                  isActive
                    ? "bg-white text-[#00505b] border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] font-bold"
                    : "text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-100/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? "text-[#00505b]" : "text-slate-400 group-hover:text-slate-600"
                  }`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Subsection: Devices */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
            <span>Devices</span>
          </div>
          <div className="space-y-0.5 max-h-[300px] overflow-y-auto pr-1">
            {devices.length === 0 ? (
              <span className="text-[10px] text-slate-400 px-3 block">{t("noDevicesOnline")}</span>
            ) : (
              devices.map((device) => {
                const isSelected = selectedDeviceId === device.deviceId;
                const isOnline = device.status === "online" || device.status === "detected";
                const isIncident = device.status === "detected";
                
                return (
                  <button
                    key={device.deviceId}
                    onClick={() => setSelectedDeviceId(device.deviceId)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center justify-between group focus:outline-none border ${
                      isSelected
                        ? "text-[#00505b] font-bold bg-white border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                        : "text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-100/40"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        isIncident ? "bg-red-500 animate-pulse" : isOnline ? "bg-emerald-500" : "bg-slate-300"
                      }`} />
                      <span className="truncate">📹 {device.deviceId}</span>
                    </div>
                    {isOnline && device.battery !== undefined && (
                      <span className="text-[9px] text-slate-400 font-mono">
                        {device.battery}%
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Profile Panel at the Bottom (Mockup Style) */}
      {userName && (
        <div className="p-3 border-t border-slate-200 bg-[#f8fafc] shrink-0">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-[#00505b] text-[10px] shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <h4 className="text-[10px] font-bold text-slate-800 leading-none truncate">{userName}</h4>
                {userEmail && (
                  <span className="text-[8px] text-slate-400 font-medium truncate block mt-0.5">{userEmail}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <button 
                className="w-6 h-6 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-none focus:outline-none"
                title={t("settings")}
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-6 h-6 rounded-lg hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-slate-400 transition-colors cursor-pointer border-none focus:outline-none"
                title={t("signOut")}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
