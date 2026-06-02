"use client";

import React from "react";

interface TimelineFlowProps {
  currentTime: number;
  duration: number;
  handleTimelineClick: (secs: number) => void;
}

export default function TimelineFlow({
  currentTime,
  duration,
  handleTimelineClick,
}: TimelineFlowProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-lg flex flex-col relative overflow-hidden">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
        AI EVENT SEGMENTS TIMELINE FLOW
      </h3>

      {/* Timeline marker rules */}
      <div className="flex justify-between text-[9px] text-gray-400 font-mono tracking-wider font-bold mb-1 px-1 select-none">
        <span>00:00</span>
        <span>00:05</span>
        <span>00:10</span>
        <span>00:15</span>
        <span>00:20</span>
        <span>00:25</span>
        <span>00:30</span>
        <span>00:35</span>
        <span>00:40</span>
        <span>00:45</span>
        <span>00:50</span>
        <span>00:55</span>
        <span>00:60</span>
      </div>

      {/* Scrolling wrapper frame segments */}
      <div className="relative border border-gray-250 rounded-xl overflow-hidden bg-gray-50 select-none">
        <div className="grid gap-1 h-14 md:h-18 p-1" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}>
          
          {/* Sequence of 13 mock segment panels */}
          {Array.from({ length: 13 }).map((_, idx) => {
            const progressSecs = Math.floor((idx / 12) * duration);
            const isSelected = Math.abs(currentTime - progressSecs) < (duration / 13);
            const hasDetection = idx === 0 || idx === 1 || idx === 8 || idx === 9 || idx === 11;
            
            return (
              <div
                key={idx}
                onClick={() => handleTimelineClick(progressSecs)}
                className={`relative rounded-lg overflow-hidden border cursor-pointer group/item transition-all hover:scale-[1.03] ${
                  isSelected
                    ? "border-indigo-600 ring-2 ring-indigo-600/30"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                {/* Mock drawing container */}
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  {/* Inside thumbnail image mockup */}
                  <div className="w-full h-full bg-[#2c2c3e] flex items-center justify-center text-[7px] text-white/50 font-mono scale-90">
                    {/* Visual representation of shelves */}
                    <div className="w-[80%] h-1 bg-white/10 absolute top-2"></div>
                    <div className="w-[80%] h-1 bg-white/10 absolute top-5"></div>
                    
                    {/* Figure blocks */}
                    <div className="w-2.5 h-6 bg-orange-400 rounded-sm absolute left-3 top-3"></div>
                    <div className="w-3.5 h-8 bg-blue-500 rounded-sm absolute right-3 top-2"></div>
                    
                    {/* Glowing detected box */}
                    {hasDetection && (
                      <div className="absolute inset-1 border border-red-500/80 rounded bg-red-500/10 flex items-center justify-center animate-pulse">
                        <span className="text-[6px] font-black text-red-500 font-mono">AI</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Overlay timeline index */}
                <div className="absolute bottom-0.5 right-1 text-[7px] md:text-[8px] font-bold font-mono text-white bg-black/60 px-1 rounded">
                  {idx * 5}s
                </div>
              </div>
            );
          })}

        </div>

        {/* Moving Yellow scrub line synced perfectly with video currentTime */}
        <div
          className="absolute top-0 bottom-0 w-[3px] bg-yellow-400 border-l border-r border-yellow-500/50 shadow-lg pointer-events-none transition-all duration-100"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        >
          <div className="w-3 h-3 rounded-full bg-yellow-400 absolute -top-1 -left-1 ring-2 ring-white/80 shadow border border-yellow-500"></div>
        </div>

      </div>

    </div>
  );
}
