"use client";

import React from "react";
import Image from "next/image";
import { Bell, Plus, Search } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md shrink-0 z-40">
      {/* Brand Logo Section */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo.png"
          alt="RescuEdge Logo"
          width={1093}
          height={379}
          className="h-9 w-auto object-contain"
          priority
        />
      </div>

      {/* Center Search Input with Mockup style */}
      <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="w-full pl-10 pr-16 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#004d56] focus:ring-1 focus:ring-[#004d56]/20 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 select-none pointer-events-none">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="pointer-events-auto text-[10px] text-slate-400 hover:text-slate-600 font-bold px-1"
              >
                Clear
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[9px] font-bold text-slate-400 shadow-sm">
                <span>⌘</span>F
              </kbd>
            )}
          </div>
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-3">
        {/* Language Slider Toggle */}
        <div className="flex items-center border-r border-slate-200 pr-4 mr-1">
          <div className="relative flex items-center bg-slate-100 border border-slate-200 rounded-full w-[76px] h-7 select-none p-0.5">
            {/* Sliding background circle */}
            <div 
              className={`absolute top-0.5 bottom-0.5 w-[34px] bg-[#00505b] rounded-full shadow-sm transition-all duration-200 ease-out ${
                language === "vi" ? "left-0.5" : "left-[38px]"
              }`}
            />
            {/* VI button */}
            <button
              onClick={() => setLanguage("vi")}
              className={`w-[34px] h-full flex items-center justify-center text-[10px] font-bold z-10 transition-colors duration-200 cursor-pointer border-none bg-transparent focus:outline-none ${
                language === "vi" ? "text-white" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              VI
            </button>
            {/* EN button */}
            <button
              onClick={() => setLanguage("en")}
              className={`w-[34px] h-full flex items-center justify-center text-[10px] font-bold z-10 transition-colors duration-200 cursor-pointer border-none bg-transparent focus:outline-none ${
                language === "en" ? "text-white" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <button className="relative w-9 h-9 rounded-xl hover:bg-slate-50 flex items-center justify-center border border-slate-200 transition-colors cursor-pointer group shadow-sm bg-white focus:outline-none">
          <Bell className="w-4 h-4 text-slate-600 group-hover:text-[#004d56] transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>
        
        <button className="w-9 h-9 rounded-xl hover:bg-slate-50 flex items-center justify-center border border-slate-200 transition-colors cursor-pointer text-[#004d56] shadow-sm bg-white font-bold focus:outline-none">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
