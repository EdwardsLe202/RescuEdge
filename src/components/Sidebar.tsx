"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Video,
  AlertTriangle,
  Lock,
  FileSpreadsheet,
  Settings,
  LogOut,
  Send,
} from "lucide-react";
import { IDevice } from "@/types/api";

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
    <aside className="w-64 border-r border-gray-100 flex flex-col justify-between bg-white/40 backdrop-blur-md hidden lg:flex shrink-0">
      {/* Upper menu navigation elements */}
      <div className="p-4 space-y-7 overflow-y-auto">
        
        {/* Menu Categories */}
        <div className="space-y-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "recordings", label: "Recordings", icon: Video },
            { id: "alerts", label: "Alerts", icon: AlertTriangle },
            { id: "dispatch", label: "Send Units", icon: Send },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
                  }`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Subsection: Devices */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            <span className="flex items-center gap-1">
              <Video className="w-3 h-3" /> All Devices
            </span>
          </div>
          <div className="space-y-0.5">
            {devices.length === 0 ? (
              <span className="text-[10px] text-gray-400 px-4 block">No devices online</span>
            ) : (
              devices.map((device) => {
                const isSelected = selectedDeviceId === device.deviceId;
                const isOnline = device.status === "online" || device.status === "detected";
                const isIncident = device.status === "detected";
                
                return (
                  <button
                    key={device.deviceId}
                    onClick={() => setSelectedDeviceId(device.deviceId)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? "text-indigo-600 font-semibold bg-indigo-50 border-l-4 border-indigo-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        isIncident ? "bg-red-500 animate-pulse" : isOnline ? "bg-emerald-500" : "bg-gray-300"
                      }`} />
                      <span className="truncate">📹 {device.deviceId}</span>
                    </div>
                    {isOnline && device.battery !== undefined && (
                      <span className="text-[10px] text-gray-400 font-mono">
                        🔋{device.battery}%
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Profile Panel at the Bottom */}
      {userName && (
        <div className="p-4 border-t border-gray-100 bg-white/30 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 border border-indigo-200/50 shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-gray-800 leading-tight truncate">{userName}</h4>
                {userEmail && (
                  <span className="text-[10px] text-gray-400 font-medium truncate block">{userEmail}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-7 h-7 rounded-lg hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
