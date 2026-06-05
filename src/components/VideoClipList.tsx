"use client";

import React from "react";
import { Film, Clock, Play, Video } from "lucide-react";
import { IVideoClip } from "@/types/api";
import { clipName, formatBytes } from "@/utils/video";
import { useLanguage } from "@/hooks/useLanguage";

interface VideoClipListProps {
  videos: IVideoClip[];
  selectedVideoKey: string | null;
  onSelect: (videoKey: string) => void;
}

export default function VideoClipList({ videos, selectedVideoKey, onSelect }: VideoClipListProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-slate-200/80 rounded-[20px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mt-0.5">
          <Film className="w-4 h-4 text-[#00505b]" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
            {t("clipLibrary")}
            <span className="text-[10px] font-bold text-slate-400 font-mono">({videos.length})</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{t("clipLibraryDesc")}</p>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Video className="w-9 h-9 text-slate-300 mb-2" />
          <span className="text-xs font-semibold text-slate-400">{t("noClipsForDevice")}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {videos.map((video, index) => {
            const isSelected = video.videoKey === selectedVideoKey;
            const isLatest = index === 0;
            return (
              <button
                key={video.videoKey}
                onClick={() => onSelect(video.videoKey)}
                className={`group flex items-center gap-3.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-200 shadow-sm"
                    : "bg-slate-50/60 border-slate-200/70 hover:border-slate-300 hover:bg-white hover:shadow-sm"
                }`}
              >
                {/* Thumbnail placeholder */}
                <div
                  className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected ? "bg-[#00d084] text-[#00505b]" : "bg-slate-200/70 text-slate-500 group-hover:bg-slate-300/70"
                  }`}
                >
                  <Play className={`w-5 h-5 ${isSelected ? "fill-current translate-x-px" : "translate-x-px"}`} />
                </div>

                {/* Meta */}
                <div className="min-w-0 flex-1">
                  {/* Row 1: name + latest badge */}
                  <div className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 text-[13px] font-bold text-slate-800 font-mono truncate">
                      {clipName(video.videoKey)}
                    </span>
                    {isLatest && (
                      <span className="shrink-0 text-[8px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md tracking-wider">
                        {t("latestBadge")}
                      </span>
                    )}
                  </div>

                  {/* Row 2: timestamp */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mt-1.5">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span className="truncate">{new Date(video.lastModified).toLocaleString()}</span>
                  </div>

                  {/* Row 3: size + now-playing */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-[11px] text-slate-400 font-mono">{formatBytes(video.size)}</span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[9px] font-extrabold text-emerald-600 tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t("nowPlaying")}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
