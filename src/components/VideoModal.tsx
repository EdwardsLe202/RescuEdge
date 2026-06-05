"use client";

import React, { useEffect, useState } from "react";
import { X, VideoOff, Clock } from "lucide-react";
import { IVideoClip } from "@/types/api";
import { toPlayableSource, clipName, formatBytes } from "@/utils/video";
import { useLanguage } from "@/hooks/useLanguage";

interface VideoModalProps {
  clip: IVideoClip | null;
  onClose: () => void;
}

export default function VideoModal({ clip, onClose }: VideoModalProps) {
  const { t } = useLanguage();
  // Starts at "loading"; the parent remounts this component per clip (via `key`),
  // so the state resets automatically when a different clip is opened.
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // Close on Escape
  useEffect(() => {
    if (!clip) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clip, onClose]);

  if (!clip) return null;

  const source = toPlayableSource(clip.streamUrl);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#09090e] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
          <div className="min-w-0">
            <p className="text-xs font-bold text-white font-mono truncate">{clipName(clip.videoKey)}</p>
            <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3 h-3" />
              {new Date(clip.lastModified).toLocaleString()}
              <span className="text-gray-600">•</span>
              <span className="font-mono">{formatBytes(clip.size)}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video area */}
        <div className="relative aspect-video bg-[#09090e] flex items-center justify-center">
          <video
            key={clip.videoKey}
            src={source}
            controls
            autoPlay
            className="w-full h-full"
            onCanPlay={() => setStatus("ready")}
            onPlaying={() => setStatus("ready")}
            onError={() => setStatus("error")}
          />

          {status === "loading" && (
            <div className="absolute inset-0 z-10 bg-[#09090e] flex flex-col items-center justify-center gap-3 select-none">
              <div className="w-10 h-10 rounded-full border-[3px] border-white/10 border-t-[#00d084] animate-spin" />
              <span className="text-xs font-semibold text-gray-300">{t("loadingVideo")}</span>
              <span className="text-[10px] text-gray-500 max-w-[220px] text-center leading-relaxed">
                {t("transcodingHint")}
              </span>
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 z-10 bg-[#09090e] flex flex-col items-center justify-center gap-3 select-none">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <VideoOff className="w-7 h-7 text-red-400" />
              </div>
              <span className="text-sm font-bold text-white">{t("videoLoadError")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
