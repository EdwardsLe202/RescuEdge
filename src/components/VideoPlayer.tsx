"use client";

import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  VideoOff,
  Tv,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { toPlayableSource } from "@/utils/video";

interface VideoPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number | ((prev: number) => number)) => void;
  duration: number;
  setDuration: (duration: number) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
  streamUrl?: string | null;
  mode?: string;
  cameraEnabled?: boolean;
  alertThreshold?: number;
  onUpdateDesiredState?: (data: { mode?: string; cameraEnabled?: boolean; alertThreshold?: number }) => void;
  isUpdatingDesiredState?: boolean;
}

export default function VideoPlayer({
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
  playbackSpeed,
  setPlaybackSpeed,
  isMuted,
  setIsMuted,
  volume,
  setVolume,
  streamUrl,
  mode,
  cameraEnabled,
  alertThreshold,
  onUpdateDesiredState,
  isUpdatingDesiredState,
}: VideoPlayerProps) {
  const { t } = useLanguage();
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Hydration state
  const [hasMounted, setHasMounted] = useState(false);

  // Controls auto-hide UI state
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Simulation mode state
  const [isSimulationMode, setIsSimulationMode] = useState(false);

  // Video readiness: skeleton while loading/transcoding, controls only when ready
  const [videoStatus, setVideoStatus] = useState<"loading" | "ready" | "error">("loading");

  // Reset simulation when device/streamUrl changes
  useEffect(() => {
    setIsSimulationMode(false);
  }, [streamUrl]);

  // Re-enter the loading state whenever the source changes (new device or
  // when the simulation feed is activated) so the skeleton shows again.
  useEffect(() => {
    setVideoStatus("loading");
  }, [streamUrl, isSimulationMode]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    setHasMounted(true);
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Handle parent-driven seek triggers (e.g. from TimelineFlow)
  useEffect(() => {
    if (playerRef.current && Math.abs(playerRef.current.currentTime - currentTime) > 1.5) {
      playerRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const isVideoUrl = (url?: string | null) => {
    if (!url) return false;
    return (
      url.includes(".mp4") ||
      url.includes(".avi") ||
      url.includes(".m3u8") ||
      url.includes("youtube.com") ||
      url.includes("vimeo.com")
    );
  };

  const resolveVideoSource = (url?: string | null): string => {
    if (!url) return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    return toPlayableSource(url);
  };

  const videoSource = isVideoUrl(streamUrl)
    ? resolveVideoSource(streamUrl)
    : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (playerRef.current) {
      playerRef.current.currentTime = time;
    }
  };

  const handleRewind = () => {
    const target = Math.max(0, currentTime - 10);
    setCurrentTime(target);
    if (playerRef.current) {
      playerRef.current.currentTime = target;
    }
  };

  const handleForward = () => {
    const target = Math.min(duration, currentTime + 10);
    setCurrentTime(target);
    if (playerRef.current) {
      playerRef.current.currentTime = target;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (container) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        container.requestFullscreen().catch((err) => {
          console.error("Error attempting to enable full-screen mode:", err);
        });
      }
    }
  };

  const formatTime = (timeInSecs: number) => {
    const hrs = Math.floor(timeInSecs / 3600);
    const mins = Math.floor((timeInSecs % 3600) / 60);
    const secs = Math.floor(timeInSecs % 60);
    
    const displayMins = mins < 10 ? `0${mins}` : mins;
    const displaySecs = secs < 10 ? `0${secs}` : secs;

    if (hrs > 0) {
      return `${hrs}:${displayMins}:${displaySecs}`;
    }
    return `${displayMins}:${displaySecs}`;
  };

  if (!hasMounted) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col mb-6">
        <div className="relative aspect-video max-h-[500px] w-full rounded-2xl bg-[#09090e] overflow-hidden flex items-center justify-center">
          <span className="text-sm text-gray-400 font-medium animate-pulse">{t("initializingPlayer")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col mb-6">
      
      {/* ReactPlayer Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        className="relative aspect-video max-h-[500px] w-full rounded-2xl bg-[#09090e] overflow-hidden flex items-center justify-center shadow-inner group"
      >
        {!streamUrl && !isSimulationMode ? (
          <div className="absolute inset-0 bg-[#09090e] flex flex-col items-center justify-center p-6 text-center select-none z-20">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mb-4 shadow-xl backdrop-blur-md">
                <VideoOff className="w-8 h-8 text-emerald-500" />
              </div>
              
              <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                {t("noLiveSignal")}
              </h3>
              
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                {t("offlineDesc")}
              </p>
              
              <button
                onClick={() => {
                  setIsSimulationMode(true);
                  setIsPlaying(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#00d084] hover:bg-[#00b372] text-[#00505b] text-xs font-bold border-none flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Tv className="w-4 h-4" />
                {t("activateSimulation")}
              </button>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[9px] text-gray-500 font-mono tracking-wider font-semibold">
              <span>{t("statusInactive")}</span>
              <span>{t("feedNull")}</span>
            </div>
          </div>
        ) : (
          <>
            <ReactPlayer
              ref={playerRef}
              src={videoSource}
              playing={isPlaying}
              volume={isMuted ? 0 : volume}
              muted={isMuted}
              playbackRate={playbackSpeed}
              width="100%"
              height="100%"
              controls={false}
              onLoadStart={() => setVideoStatus("loading")}
              onCanPlay={() => setVideoStatus("ready")}
              onPlaying={() => setVideoStatus("ready")}
              onError={() => setVideoStatus("error")}
              onTimeUpdate={(e) => {
                setCurrentTime(e.currentTarget.currentTime);
              }}
              onDurationChange={(e) => {
                setDuration(e.currentTarget.duration);
              }}
              className="pointer-events-none"
            />

            {/* Loading skeleton — blocks interaction until the video is ready */}
            {videoStatus === "loading" && (
              <div className="absolute inset-0 z-30 bg-[#09090e] flex flex-col items-center justify-center select-none">
                {/* Skeleton placeholders mimicking the control bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-3 animate-pulse">
                  <div className="h-1 w-full rounded-full bg-white/10" />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded-full bg-white/10" />
                      <div className="w-5 h-5 rounded-full bg-white/10" />
                      <div className="w-5 h-5 rounded-full bg-white/10" />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-16 h-5 rounded-md bg-white/10" />
                      <div className="w-5 h-5 rounded bg-white/10" />
                    </div>
                  </div>
                </div>

                {/* Center spinner + status text */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-[3px] border-white/10 border-t-[#00d084] animate-spin" />
                  <span className="text-xs font-semibold text-gray-300">{t("loadingVideo")}</span>
                  <span className="text-[10px] text-gray-500 max-w-[220px] text-center leading-relaxed">
                    {t("transcodingHint")}
                  </span>
                </div>
              </div>
            )}

            {/* Error state */}
            {videoStatus === "error" && (
              <div className="absolute inset-0 z-30 bg-[#09090e] flex flex-col items-center justify-center gap-3 select-none">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <VideoOff className="w-7 h-7 text-red-400" />
                </div>
                <span className="text-sm font-bold text-white">{t("videoLoadError")}</span>
              </div>
            )}

            {/* Controls — only mounted once the video is ready */}
            {videoStatus === "ready" && (
            <>
            {/* Play/Pause overlay */}
            <div
              onClick={handlePlayPause}
              className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-8 cursor-pointer transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <button
                onClick={(e) => { e.stopPropagation(); handleRewind(); }}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                title="-10s"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
                className="w-16 h-16 rounded-full bg-[#00d084] hover:bg-[#00b372] text-[#00505b] flex items-center justify-center shadow-2xl transition-transform hover:scale-105 border-none cursor-pointer"
              >
                {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current translate-x-0.5" />}
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); handleForward(); }}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/10 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                title="+10s"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>

            {/* Live Signal Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20 shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#00d084] animate-pulse"></span>
              <span className="text-[9px] font-bold text-white font-mono tracking-wider">
                {isVideoUrl(streamUrl) ? t("liveStreamActive") : t("playbackSimulation")}
              </span>
            </div>

            {/* Bottom Control Bar Overlay */}
            <div
              className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent transition-transform duration-300 flex flex-col gap-3 ${
                showControls ? "translate-y-0" : "translate-y-full"
              }`}
            >
              {/* Scrub bar */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-white font-mono select-none">
                  {formatTime(currentTime)}
                </span>
                
                <div className="flex-1 relative py-3 cursor-pointer group select-none">
                  {/* Custom Track Background */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-white/20 rounded-full overflow-hidden">
                    {/* Custom Track Progress */}
                    <div 
                      className="h-full bg-[#00d084] rounded-full transition-all duration-75"
                      style={{ width: `${(currentTime / (duration || 100)) * 100}%` }}
                    />
                  </div>
                  {/* Custom Thumb dot */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border border-[#00d084] shadow-[0_0_10px_rgba(0,208,132,0.8)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `calc(${(currentTime / (duration || 100)) * 100}% - 6px)` }}
                  />
                  {/* Invisible native range input on top */}
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeekChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                </div>

                <span className="text-[10px] font-bold text-white font-mono select-none">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Controls buttons row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-white">
                  <button
                    onClick={handlePlayPause}
                    className="hover:text-emerald-500 transition-colors cursor-pointer border-none bg-transparent"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <button
                    onClick={handleRewind}
                    className="hover:text-emerald-500 transition-colors cursor-pointer border-none bg-transparent"
                    title="-10s"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleForward}
                    className="hover:text-emerald-500 transition-colors cursor-pointer border-none bg-transparent"
                    title="+10s"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2 group/volume">
                    <button
                      onClick={handleToggleMute}
                      className="hover:text-emerald-500 transition-colors cursor-pointer border-none bg-transparent"
                    >
                      {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    
                    {/* Volume slider container */}
                    <div className="relative w-16 h-6 flex items-center cursor-pointer opacity-0 group-hover/volume:opacity-100 transition-opacity duration-200 select-none">
                      {/* Custom Track Background */}
                      <div className="absolute left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden">
                        {/* Custom Track Progress */}
                        <div 
                          className="h-full bg-[#00d084] rounded-full"
                          style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                        />
                      </div>
                      {/* Custom Thumb dot */}
                      <div 
                        className="absolute w-2 h-2 rounded-full bg-white border border-[#00d084] shadow pointer-events-none"
                        style={{ left: `calc(${(isMuted ? 0 : volume) * 100}% - 4px)` }}
                      />
                      {/* Invisible native range input */}
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-white">
                  {/* Playback speed rate */}
                  <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5 border border-white/10">
                    {[1.0, 1.25, 1.5, 2.0].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setPlaybackSpeed(speed)}
                        className={`px-2 py-0.5 text-[9px] font-bold rounded transition-all cursor-pointer border-none ${
                          playbackSpeed === speed
                            ? "bg-[#004d56] text-white shadow font-black"
                            : "text-white/60 hover:text-white bg-transparent"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleFullscreen}
                    className="hover:text-emerald-500 transition-colors cursor-pointer border-none bg-transparent"
                    title={t("fullscreen") || "Fullscreen"}
                  >
                    <Maximize className="w-5 h-5" />
                  </button>

                  <button className="hover:text-emerald-500 transition-colors cursor-pointer border-none bg-transparent">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            </>
            )}
          </>
        )}

      </div>

      {/* DEVICE SHADOW CONTROL PANEL */}
      {onUpdateDesiredState && (
        <div id="device-shadow-config" className="mt-5 pt-4 border-t border-slate-100">
          <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 select-none">
            {t("deviceConfigTitle")}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Mode Switcher */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider select-none">
                {t("operationMode")}
              </label>
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/50 rounded-xl p-1 w-fit">
                {["live", "offline"].map((m) => (
                  <button
                    key={m}
                    disabled={isUpdatingDesiredState}
                    onClick={() => onUpdateDesiredState({ mode: m })}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer border-none ${
                      mode === m
                        ? "bg-[#004d56] text-white shadow"
                        : "text-slate-500 hover:text-slate-800 bg-transparent"
                    }`}
                  >
                    {m === "live" ? t("liveMode") : t("offlineModeLabel")}
                  </button>
                ))}
              </div>
            </div>

            {/* Camera Enable Toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider select-none">
                {t("cameraSensor")}
              </label>
              <button
                disabled={isUpdatingDesiredState}
                onClick={() => onUpdateDesiredState({ cameraEnabled: !cameraEnabled })}
                className={`px-4 py-2 text-xs font-bold rounded-xl border w-fit cursor-pointer transition-all ${
                  cameraEnabled
                    ? "bg-emerald-50 border-emerald-250 text-emerald-600 shadow-sm"
                    : "bg-red-50 border-red-200 text-red-650"
                }`}
              >
                {cameraEnabled ? t("sensorEnabled") : t("sensorDisabled")}
              </button>
            </div>

            {/* Alert Threshold Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider select-none">
                  {t("aiAlertThreshold")}
                </label>
                <span className="text-[10px] font-bold text-emerald-600 font-mono">
                  {alertThreshold !== undefined ? Math.round(alertThreshold * 100) : 85}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  disabled={isUpdatingDesiredState}
                  value={alertThreshold !== undefined ? alertThreshold : 0.85}
                  onChange={(e) => onUpdateDesiredState({ alertThreshold: parseFloat(e.target.value) })}
                  className="flex-1 h-1.5 bg-gray-200 accent-[#00d084] rounded-lg appearance-none cursor-pointer outline-none"
                />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
