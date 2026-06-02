"use client";

import React from "react";
import Image from "next/image";
import { Bell, Plus, Search } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <header className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white/70 backdrop-blur-md shrink-0">
      {/* Brand Logo Section */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo.png"
          alt="RescuEdge Logo"
          width={240}
          height={60}
          className="object-contain max-h-14"
          priority
        />
      </div>

      {/* Center Address Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-xl mx-12">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search 'color', 'vehicle', 'people', 'objects'..."
            className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200/80 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-semibold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-4">
        <button className="relative w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center border border-gray-100 transition-colors cursor-pointer group">
          <Bell className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        </button>
        
        <button className="w-10 h-10 rounded-xl hover:bg-gray-50 flex items-center justify-center border border-gray-100 transition-colors cursor-pointer text-indigo-600">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
