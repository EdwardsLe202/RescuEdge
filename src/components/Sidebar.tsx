"use client";

import React from "react";
import {
  LayoutDashboard,
  Video,
  AlertTriangle,
  Lock,
  FileSpreadsheet,
  MapPin,
  Plus,
  Settings,
} from "lucide-react";

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  locations: { id: number; name: string }[];
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  cameras: { id: number; name: string }[];
  selectedCamera: string;
  setSelectedCamera: (cam: string) => void;
  onAddNewLocation: () => void;
  onAddNewCamera: () => void;
}

export default function Sidebar({
  activeMenu,
  setActiveMenu,
  locations,
  selectedLocation,
  setSelectedLocation,
  cameras,
  selectedCamera,
  setSelectedCamera,
  onAddNewLocation,
  onAddNewCamera,
}: SidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-100 flex flex-col justify-between bg-white/40 backdrop-blur-md hidden lg:flex shrink-0">
      {/* Upper menu navigation elements */}
      <div className="p-4 space-y-7 overflow-y-auto">
        
        {/* Menu Categories */}
        <div className="space-y-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "recordings", label: "Recordings", icon: Video },
            { id: "alerts", label: "Alerts", icon: AlertTriangle, badge: "4" },
            { id: "access", label: "Access Control", icon: Lock },
            { id: "logs", label: "Incident Logs", icon: FileSpreadsheet },
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
                {item.badge && (
                  <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-red-50 text-red-600 border border-red-100">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Subsection: Locations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> All Locations
            </span>
          </div>
          <div className="space-y-0.5">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc.name)}
                className={`w-full text-left px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedLocation === loc.name
                    ? "text-indigo-600 font-semibold bg-indigo-50/50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {loc.name}
              </button>
            ))}
            <button
              onClick={onAddNewLocation}
              className="w-full flex items-center gap-1.5 px-4 py-2 mt-1 rounded-lg text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors hover:bg-indigo-50/30 text-left border border-dashed border-indigo-200 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Location
            </button>
          </div>
        </div>

        {/* Subsection: Cameras */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            <span className="flex items-center gap-1">
              <Video className="w-3 h-3" /> All Cameras
            </span>
          </div>
          <div className="space-y-0.5">
            {cameras.map((cam) => (
              <button
                key={cam.id}
                onClick={() => setSelectedCamera(cam.name)}
                className={`w-full text-left px-4 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer truncate ${
                  selectedCamera === cam.name
                    ? "text-indigo-600 font-semibold bg-indigo-50/50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                🎥 {cam.name}
              </button>
            ))}
            <button
              onClick={onAddNewCamera}
              className="w-full flex items-center gap-1.5 px-4 py-2 mt-1 rounded-lg text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors hover:bg-indigo-50/30 text-left border border-dashed border-indigo-200 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Camera
            </button>
          </div>
        </div>

      </div>

      {/* Profile Panel at the Bottom */}
      <div className="p-4 border-t border-gray-100 bg-white/30 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 border border-indigo-200/50">
              PP
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-800 leading-tight">Pearl Plaha</h4>
              <span className="text-[10px] text-gray-400 font-medium">Head of Safety</span>
            </div>
          </div>
          <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
