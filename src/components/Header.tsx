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
    <header className="h-20 border-b border-slate-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md shrink-0 z-40">
      {/* Brand Logo Section */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo.png"
          alt="RescuEdge Logo"
          width={1093}
          height={379}
          className="h-16 w-auto object-contain"
          priority
        />
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
