"use client";

import React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  MessageSquare,
} from "lucide-react";

interface VideoPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number | ((prev: number) => number)) => void;
  duration: number;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  formatTime: (time: number) => string;
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
  playbackSpeed,
  setPlaybackSpeed,
  isMuted,
  setIsMuted,
  volume,
  setVolume,
  canvasRef,
  formatTime,
  streamUrl,
  mode,
  cameraEnabled,
  alertThreshold,
  onUpdateDesiredState,
  isUpdatingDesiredState,
}: VideoPlayerProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-lg flex flex-col mb-6">
      
      {/* Security Stream Monitor Display */}
      <div className="relative aspect-video max-h-[500px] w-full rounded-2xl bg-[#1e1e2e] border border-gray-800/20 overflow-hidden flex items-center justify-center shadow-inner group">
        
        {/* Render Live Stream Image if available, otherwise fallback to simulated Canvas */}
        {streamUrl ? (
          <img
            src={streamUrl}
            alt="Live Camera Feed"
            className="w-full h-full object-contain object-center max-h-[500px]"
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={560}
            height={380}
            className="w-full h-full object-cover object-center max-h-[500px]"
          />
        )}

        {/* Bounding box display (only when canvas is fallback/simulated) */}
        {!streamUrl && (
          <div className="absolute top-[48%] left-[62.5%] -translate-y-1/2 -translate-x-1/2 w-[16%] h-[25%] pointer-events-none border-2 border-red-500 rounded animate-glow-red flex flex-col items-start p-1 transition-all duration-300">
            <span className="text-[8px] md:text-[10px] font-black font-mono tracking-wide text-white bg-red-600 px-1 py-0.5 rounded shadow">
              PISTOL 95.1%
            </span>
          </div>
        )}

        {/* Overlaid Pulsing Live Signal Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/20 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse-live"></span>
          <span className="text-[10px] md:text-xs font-bold text-white font-mono tracking-wider">
            {streamUrl ? "REAL STREAM ACTIVE" : "SIMULATED STREAM"}
          </span>
        </div>

        {/* Center overlay controls triggered on hover */}
        {!streamUrl && (
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-8 pointer-events-none">
            
            {/* Skip backward 10s */}
            <button
              onClick={() => setCurrentTime((prev) => Math.max(0, (typeof prev === "number" ? prev : currentTime) - 10))}
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer pointer-events-auto shadow-lg"
              title="-10 Seconds"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Master Play/Pause toggler */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105 cursor-pointer pointer-events-auto border border-indigo-400"
              title={isPlaying ? "Pause Feed" : "Start Playback"}
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current translate-x-0.5" />}
            </button>

            {/* Skip forward 10s */}
            <button
              onClick={() => setCurrentTime((prev) => Math.min(duration, (typeof prev === "number" ? prev : currentTime) + 10))}
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer pointer-events-auto shadow-lg"
              title="+10 Seconds"
            >
              <RotateCw className="w-5 h-5" />
            </button>

          </div>
        )}

        {/* Time overlay for simulated canvas */}
        {!streamUrl && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-black/60 rounded-full border border-white/10 text-[11px] text-white/80 font-mono tracking-wide pointer-events-none">
            <span>Frame Time:</span>
            <span className="text-yellow-400 font-bold font-mono">{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        )}

      </div>

      {/* MEDIA TIMELINE & CONTROL BAR (Only for simulation mode) */}
      {!streamUrl && (
        <div className="mt-5 space-y-4">
          
          {/* Dynamic scrub bar slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 font-mono select-none">
              {formatTime(currentTime)}
            </span>
            
            {/* Slider Container */}
            <div className="flex-1 relative py-2 cursor-pointer group">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-150 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none transition-all outline-none"
              />
              {/* Glowing tracking dot */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-indigo-600 border border-white shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `calc(${(currentTime / duration) * 100}% - 7px)` }}
              ></div>
            </div>

            <span className="text-xs font-semibold text-gray-500 font-mono select-none">
              {formatTime(duration)}
            </span>
          </div>

          {/* Bottom Control Bar Layout */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-gray-100">
            
            {/* Play & seek buttons group */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-colors cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
              </button>
              
              <button
                onClick={() => setCurrentTime((prev) => Math.max(0, (typeof prev === "number" ? prev : currentTime) - 10))}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                title="-10 seconds"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentTime((prev) => Math.min(duration, (typeof prev === "number" ? prev : currentTime) + 10))}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                title="+10 seconds"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Playback rate multiplier toggle */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200/50 rounded-lg p-0.5">
                {[1.0, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                      playbackSpeed === speed
                        ? "bg-white text-indigo-600 shadow-sm border border-gray-200/50 font-black"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Mute and volume slider elements */}
              <div className="flex items-center gap-2 group/volume">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-16 md:w-20 h-1 bg-gray-200 accent-indigo-600 rounded-lg appearance-none cursor-pointer outline-none opacity-50 group-hover/volume:opacity-100 transition-opacity"
                />
              </div>
            </div>

            {/* Full screen indicator trigger */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const canvas = canvasRef.current;
                  if (canvas) {
                    if (canvas.requestFullscreen) {
                      canvas.requestFullscreen();
                    }
                  }
                }}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                title="Fullscreen canvas"
              >
                <Maximize className="w-4 h-4" />
              </button>
              
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-500 flex items-center justify-center transition-colors cursor-pointer">
                <Settings className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* DEVICE SHADOW CONTROL PANEL */}
      {onUpdateDesiredState && (
        <div className="mt-5 pt-4 border-t border-gray-150">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Device Configuration (AWS IoT Shadow State)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Mode Switcher */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Operation Mode
              </label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200/50 rounded-xl p-1 w-fit">
                {["live", "offline"].map((m) => (
                  <button
                    key={m}
                    disabled={isUpdatingDesiredState}
                    onClick={() => onUpdateDesiredState({ mode: m })}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all capitalize cursor-pointer ${
                      mode === m
                        ? "bg-indigo-600 text-white shadow"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Camera Enable Toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Camera Sensor
              </label>
              <button
                disabled={isUpdatingDesiredState}
                onClick={() => onUpdateDesiredState({ cameraEnabled: !cameraEnabled })}
                className={`px-4 py-2 text-xs font-bold rounded-xl border w-fit cursor-pointer transition-all ${
                  cameraEnabled
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm"
                    : "bg-red-50 border-red-200 text-red-600"
                }`}
              >
                {cameraEnabled ? "🟢 Enabled" : "🔴 Disabled"}
              </button>
            </div>

            {/* Alert Threshold Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  AI Alert Threshold
                </label>
                <span className="text-[10px] font-bold text-indigo-600 font-mono">
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
                  className="flex-1 h-1.5 bg-gray-200 accent-indigo-600 rounded-lg appearance-none cursor-pointer outline-none"
                />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
