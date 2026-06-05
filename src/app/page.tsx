"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  MapPin,
  MessageSquare,
  ShieldAlert,
  Video,
  AlertTriangle,
  Clock,
  Search,
  ArrowUpRight,
  Eye,
  X,
  ExternalLink,
  SlidersHorizontal,
  Plus,
} from "lucide-react";
import { toast } from "react-toastify";

// Import modular components
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MetricCards from "@/components/MetricCards";
import VideoPlayer from "@/components/VideoPlayer";
import TimelineFlow from "@/components/TimelineFlow";
import CommentsSidebar, { Comment } from "@/components/CommentsSidebar";
import AlertsFeed from "@/components/AlertsFeed";
import SendingUnits from "@/components/SendingUnits";

// Import API and WebSocket integrations
import {
  useDevices,
  useAlerts,
  useUpdateDeviceDesiredState,
  useVideoStreamUrl,
} from "@/queries";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useLanguage } from "@/hooks/useLanguage";

export default function Home() {
  const { t } = useLanguage();
  // Navigation State
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  // API Queries & WebSocket Connection
  const { data: devicesData, isLoading: isLoadingDevices } = useDevices();
  const devices = devicesData?.devices || [];

  // Automatically select the first device when devices load
  useEffect(() => {
    if (devices.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(devices[0].deviceId);
    }
  }, [devices, selectedDeviceId]);

  // Fetch alerts for the selected device
  const { data: alertsData, isLoading: isLoadingAlerts } = useAlerts(
    { deviceId: selectedDeviceId },
    !!selectedDeviceId
  );
  const alerts = alertsData?.alerts || [];

  // Fetch stream URL for the selected device
  const { data: streamData } = useVideoStreamUrl(selectedDeviceId, !!selectedDeviceId);
  const streamUrl = streamData?.streamUrl || null;

  // Update desired state mutation
  const updateDeviceMutation = useUpdateDeviceDesiredState();

  // Find currently selected device details to read its status/shadow settings
  const currentDevice = devices.find((d) => d.deviceId === selectedDeviceId);

  // Initialize real-time WebSocket connection
  useWebSocket();

  // UI Interactive States
  const [searchQuery, setSearchQuery] = useState("");
  const [isCommentsOpen, setIsCommentsOpen] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Abhay Salvi",
      avatar: "AS",
      role: "Sub Admin Dept. of Forensic",
      content: "Issue is set to be resolved. Evidence files extracted successfully.",
      timestamp: "Nov 22 01:40 PM",
    },
    {
      id: "2",
      author: "Arpit Nagar",
      avatar: "AN",
      role: "Sub Admin Dept. of Investigation",
      content: "There has been a suspect in the past backside of the store near Malviya road.",
      timestamp: "Today at 02:10 PM",
    },
    {
      id: "3",
      author: "Arpit Nagar",
      avatar: "AN",
      role: "Sub Admin Dept. of Investigation",
      content: "@AbhaySalvi move forward, proceed to tag this location for standard patrols.",
      timestamp: "Today at 02:10 PM",
      isTagged: true,
    },
  ]);

  // Video Player Logic & Simulation
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // Starts at 0
  const [duration, setDuration] = useState(6990); // Dynamic duration (default 1:56:30)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // Default speed is 1.0x
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8); // react-player volume is 0 to 1, default 0.8

  // Fetch all alerts in the system for recordings and history logs
  const { data: allAlertsData, isLoading: isLoadingAllAlerts } = useAlerts({});
  const allAlerts = allAlertsData?.alerts || [];

  // Routing Filter States
  const [minConfidenceFilter, setMinConfidenceFilter] = useState<number>(0);
  const [deviceSearchQuery, setDeviceSearchQuery] = useState<string>("");
  const [activeLightboxUrl, setActiveLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [selectedDeviceId]);

  // Action: Add new comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added: Comment = {
      id: String(comments.length + 1),
      author: "Edward (Admin)",
      avatar: "ED",
      role: "Lead Security Officer",
      content: newComment,
      timestamp: "Just now",
    };

    setComments([...comments, added]);
    setNewComment("");
  };

  // Timeline seeking click handler
  const handleTimelineClick = (secs: number) => {
    setCurrentTime(secs);
  };

  // Handle desired state shadow update from VideoPlayer controls
  const handleUpdateDesiredState = (data: {
    mode?: string;
    cameraEnabled?: boolean;
    alertThreshold?: number;
  }) => {
    if (!selectedDeviceId) return;
    updateDeviceMutation.mutate({
      deviceId: selectedDeviceId,
      data,
    });
  };

  // Determine active devices count
  const activeDevicesCount = devices.filter(
    (d) => d.status === "online" || d.status === "detected"
  ).length;

  // Determine last alert time
  const lastAlertTime =
    alerts.length > 0
      ? new Date(alerts[0].timestamp).toLocaleString()
      : "No incidents detected";

  return (
    <main className="w-screen h-screen bg-white text-[#1e293b] font-sans flex flex-col overflow-hidden selection:bg-indigo-200 selection:text-indigo-900 relative">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          devices={devices}
          selectedDeviceId={selectedDeviceId}
          setSelectedDeviceId={setSelectedDeviceId}
        />

        <section className={`flex-1 ${activeMenu === "dispatch" ? "flex flex-col min-h-0 p-0" : "p-6 overflow-y-auto bg-[#f8fafc]"}`}>
          {/* Breadcrumb Navigation trail */}
          {activeMenu !== "dispatch" && (
            <nav className="text-[10px] font-extrabold text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider select-none">
              <span className="cursor-pointer hover:text-slate-600 transition-colors">{activeMenu}</span>
              {activeMenu === "dashboard" && selectedDeviceId && (
                <>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-500 font-mono">
                    {selectedDeviceId}
                  </span>
                </>
              )}
            </nav>
          )}

          {activeMenu === "dashboard" && (
            <>
              {/* Tactical Camera Node Header Card (Teal Mockup Style) */}
              <div className="relative overflow-hidden bg-[#00505b] rounded-[20px] p-6 text-white mb-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] border border-teal-950/20">
                {/* Ambient glow decoration */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  {/* Left stats info */}
                  <div>
                    <span className="text-[9px] font-extrabold text-[#99ccd1] uppercase tracking-widest block">
                      {t("cameraFeed")}
                    </span>
                    <div className="flex items-center gap-3 mt-1.5">
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white font-mono">
                        📹 {selectedDeviceId || "Select a Device"}
                      </h2>
                      {currentDevice && (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-lg text-[9px] font-extrabold flex items-center gap-1 select-none">
                          {currentDevice.status.toUpperCase()} 100% ↗
                        </span>
                      )}
                    </div>
                    {currentDevice && (
                      <p className="text-[10px] text-slate-300 font-medium flex items-center gap-1 mt-2.5">
                        <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>{t("lastSeen")}: {new Date(currentDevice.lastSeen).toLocaleString()}</span>
                      </p>
                    )}
                  </div>

                  {/* Right Action buttons mimicking mockup */}
                  <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                    <button 
                      onClick={() => {
                        toast.info("Mock incident triggered - surveillance note panel is active.");
                      }}
                      className="px-4 py-2.5 bg-[#00d084] hover:bg-[#00b372] text-[#00505b] border-none rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5 focus:outline-none"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t("postNote") || "Add Incident"}</span>
                    </button>
                    
                    <button 
                      onClick={() => setActiveMenu("dispatch")}
                      className="px-4 py-2.5 bg-[#0c6975] hover:bg-[#0a5a64] text-[#a5e0e7] border-none rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm focus:outline-none"
                    >
                      <ArrowUpRight className="w-4 h-4 text-[#a5e0e7]" />
                      <span>{t("sendUnitsBtn") || "Dispatch"}</span>
                    </button>

                    <button 
                      onClick={() => {
                        const target = document.getElementById("device-shadow-config");
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="px-4 py-2.5 bg-[#0c6975] hover:bg-[#0a5a64] text-[#a5e0e7] border-none rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm focus:outline-none"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-[#a5e0e7]" />
                      <span>{t("deviceConfigTitle")?.split(" ")[0] || "Settings"}</span>
                    </button>
                  </div>
                </div>
              </div>

              <MetricCards
                alertsCount={alerts.length}
                activeDevicesCount={activeDevicesCount}
                lastAlertTime={lastAlertTime}
              />

              <VideoPlayer
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                currentTime={currentTime}
                setCurrentTime={setCurrentTime}
                duration={duration}
                setDuration={setDuration}
                playbackSpeed={playbackSpeed}
                setPlaybackSpeed={setPlaybackSpeed}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                volume={volume}
                setVolume={setVolume}
                streamUrl={streamUrl}
                // IoT Shadow State values (fallback if not loaded yet)
                mode={currentDevice?.status === "offline" ? "offline" : "live"}
                cameraEnabled={currentDevice?.status !== "offline"}
                alertThreshold={0.85}
                onUpdateDesiredState={handleUpdateDesiredState}
                isUpdatingDesiredState={updateDeviceMutation.isPending}
              />

              <TimelineFlow
                currentTime={currentTime}
                duration={duration}
                handleTimelineClick={handleTimelineClick}
              />

              <div className="mt-6">
                <AlertsFeed alerts={alerts} isLoading={isLoadingAlerts} />
              </div>
            </>
          )}

          {activeMenu === "recordings" && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 leading-snug">
                    {t("securityEventRecordings")}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    {t("galleryDesc")}
                  </p>
                </div>
              </div>

              {isLoadingAllAlerts ? (
                <div className="flex-1 flex items-center justify-center min-h-[300px]">
                  <span className="text-sm text-gray-400 font-medium animate-pulse">{t("loadingGallery")}</span>
                </div>
              ) : allAlerts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] bg-white border border-slate-200/80 rounded-[20px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                  <Video className="w-12 h-12 text-slate-300 mb-3" />
                  <span className="text-sm font-bold text-slate-500">{t("noRecordedEvents")}</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                  {allAlerts.map((alert) => (
                    <div 
                      key={alert.alertId} 
                      className="bg-white border border-slate-200/80 rounded-[20px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 flex flex-col group"
                    >
                      {/* Image section */}
                      <div className="relative aspect-video bg-gray-900 overflow-hidden border-b border-gray-100">
                        {alert.snapshotUrl ? (
                          <>
                            <img 
                              src={alert.snapshotUrl} 
                              alt={`Snapshot ${alert.alertId}`} 
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                              <button
                                onClick={() => setActiveLightboxUrl(alert.snapshotUrl)}
                                className="w-9 h-9 rounded-xl bg-white/90 text-gray-800 flex items-center justify-center hover:scale-105 transition-all shadow cursor-pointer border-none"
                                title="Zoom Image"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Video className="w-8 h-8" />
                          </div>
                        )}
                        
                        {/* AI Badge overlay */}
                        <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur border border-red-400/30 text-white font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                          {t("aiIncident")}
                        </div>
                      </div>

                      {/* Content section */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold font-mono text-gray-800">
                              📹 {alert.deviceId}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                              {Math.round(parseFloat(alert.confidence) * 100)}% Conf.
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mb-4">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedDeviceId(alert.deviceId);
                              setActiveMenu("dashboard");
                            }}
                            className="flex-1 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer border border-indigo-100/50"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {t("viewLiveFeed")}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeMenu === "alerts" && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="mb-5">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 leading-snug">
                  {t("alertsHistoryTitle")}
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {t("alertsHistoryDesc")}
                </p>
              </div>

              {/* Alerts statistics row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                      {t("totalDetections")}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                      All Time
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-800 tracking-tight font-mono mt-3">
                    {isLoadingAllAlerts ? "..." : allAlerts.length}
                  </div>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                      {t("highRiskAlerts")}
                    </span>
                    <span className="text-[9px] text-red-650 font-bold bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">
                      Critical
                    </span>
                  </div>
                  <div className="text-2xl font-black text-red-600 tracking-tight font-mono mt-3">
                    {isLoadingAllAlerts ? "..." : allAlerts.filter(a => parseFloat(a.confidence) >= 0.9).length}
                  </div>
                </div>
                <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                      {t("camerasAffected")}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                      Unique
                    </span>
                  </div>
                  <div className="text-2xl font-black text-[#004d56] tracking-tight font-mono mt-3">
                    {isLoadingAllAlerts ? "..." : new Set(allAlerts.map(a => a.deviceId)).size}
                  </div>
                </div>
              </div>

              {/* Filtering control bar */}
              <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={t("searchByCameraId")}
                    value={deviceSearchQuery}
                    onChange={(e) => setDeviceSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-slate-700 placeholder-gray-400 focus:outline-none focus:border-[#004d56] focus:ring-1 focus:ring-[#004d56]/25 transition-all bg-white"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                    {t("minConfidence")}: {Math.round(minConfidenceFilter * 100)}%
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={minConfidenceFilter}
                    onChange={(e) => setMinConfidenceFilter(parseFloat(e.target.value))}
                    className="w-32 h-1.5 bg-gray-200 accent-[#00cc88] rounded-lg appearance-none cursor-pointer outline-none"
                  />
                </div>
              </div>

              {/* Table section */}
              {isLoadingAllAlerts ? (
                <div className="flex-1 flex items-center justify-center min-h-[300px]">
                  <span className="text-sm text-gray-400 font-medium animate-pulse">{t("loadingAlertsHistory")}</span>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/80 rounded-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden flex-1 min-h-0 flex flex-col">
                  <div className="overflow-x-auto flex-1 min-h-0">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-150 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="p-4 w-24">{t("snapshotCol")}</th>
                          <th className="p-4">{t("timestampCol")}</th>
                          <th className="p-4">{t("cameraIdCol")}</th>
                          <th className="p-4">{t("confidenceCol")}</th>
                          <th className="p-4">{t("distanceCol")}</th>
                          <th className="p-4">{t("inferenceCol")}</th>
                          <th className="p-4 text-right">{t("actionCol")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                        {allAlerts
                          .filter((alert) => {
                            const matchesSearch = alert.deviceId.toLowerCase().includes(deviceSearchQuery.toLowerCase());
                            const matchesConfidence = parseFloat(alert.confidence) >= minConfidenceFilter;
                            return matchesSearch && matchesConfidence;
                          })
                          .map((alert) => {
                            const confNum = parseFloat(alert.confidence);
                            const confBadgeClass = confNum >= 0.9 
                              ? "bg-red-50 text-red-600 border-red-100" 
                              : confNum >= 0.75 
                              ? "bg-amber-50 text-amber-600 border-amber-100" 
                              : "bg-yellow-50 text-yellow-600 border-yellow-100";
                            
                            return (
                              <tr key={alert.alertId} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-3">
                                  {alert.snapshotUrl ? (
                                    <div 
                                      onClick={() => setActiveLightboxUrl(alert.snapshotUrl)}
                                      className="w-16 h-10 rounded-lg overflow-hidden bg-gray-900 border border-gray-200/50 cursor-pointer relative group/thumb shadow-sm"
                                    >
                                      <img 
                                        src={alert.snapshotUrl} 
                                        alt="Thumbnail" 
                                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform" 
                                      />
                                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                        <Eye className="w-3 h-3 text-white" />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-16 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-150">
                                      <AlertTriangle className="w-4 h-4" />
                                    </div>
                                  )}
                                </td>
                                <td className="p-4 font-mono text-gray-500">
                                  {new Date(alert.timestamp).toLocaleString()}
                                </td>
                                <td className="p-4 font-mono font-bold text-gray-800">
                                  {alert.deviceId}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${confBadgeClass}`}>
                                    {Math.round(confNum * 100)}%
                                  </span>
                                </td>
                                <td className="p-4 font-mono">
                                  {alert.distance ? `${alert.distance}m` : "N/A"}
                                </td>
                                <td className="p-4 font-mono">
                                  {alert.inferenceMs ? `${alert.inferenceMs} ms` : "N/A"}
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => {
                                      setSelectedDeviceId(alert.deviceId);
                                      setActiveMenu("dashboard");
                                    }}
                                    className="py-1.5 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[10px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer border border-indigo-100/50"
                                  >
                                    {t("monitorBtn")} <ArrowUpRight className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeMenu === "dispatch" && (
            <SendingUnits onBackToDashboard={() => setActiveMenu("dashboard")} />
          )}
        </section>

        {activeMenu === "dashboard" && (
          <CommentsSidebar
            isCommentsOpen={isCommentsOpen}
            setIsCommentsOpen={setIsCommentsOpen}
            comments={comments}
            newComment={newComment}
            setNewComment={setNewComment}
            onAddComment={handleAddComment}
          />
        )}

        {/* Floater arrow button to open the comments log if collapsed */}
        {activeMenu === "dashboard" && !isCommentsOpen && (
          <button
            onClick={() => setIsCommentsOpen(true)}
            className="absolute right-4 top-4 z-40 w-10 h-10 rounded-full bg-white hover:bg-gray-50 text-indigo-600 shadow-xl border border-indigo-100 flex items-center justify-center cursor-pointer hover:scale-105 transition-all"
            title="Expand comments panel"
          >
            <MessageSquare className="w-5 h-5 text-indigo-600 animate-pulse" />
          </button>
        )}
      </div>

      {/* Lightbox Modal for Snapshot Previews */}
      {activeLightboxUrl && (
        <div 
          onClick={() => setActiveLightboxUrl(null)}
          className="fixed inset-0 z-50 bg-black/85 flex flex-col items-center justify-center p-4 backdrop-blur-md cursor-zoom-out"
        >
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setActiveLightboxUrl(null); }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer border-none"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="relative max-w-5xl max-h-[85vh] select-none" onClick={(e) => e.stopPropagation()}>
            <img
              src={activeLightboxUrl}
              alt="High Resolution Alert Snap"
              className="w-full h-full max-h-[85vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
            />
          </div>
        </div>
      )}
    </main>
  );
}
