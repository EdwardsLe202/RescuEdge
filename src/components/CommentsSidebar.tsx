"use client";

import React from "react";
import { MessageSquare, ChevronsRight, Send } from "lucide-react";

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  timestamp: string;
  isTagged?: boolean;
}

interface CommentsSidebarProps {
  isCommentsOpen: boolean;
  setIsCommentsOpen: (open: boolean) => void;
  comments: Comment[];
  newComment: string;
  setNewComment: (comment: string) => void;
  onAddComment: (e: React.FormEvent) => void;
}

export default function CommentsSidebar({
  isCommentsOpen,
  setIsCommentsOpen,
  comments,
  newComment,
  setNewComment,
  onAddComment,
}: CommentsSidebarProps) {
  return (
    <aside
      className={`border-l border-gray-100 bg-white/70 backdrop-blur-md flex flex-col justify-between shrink-0 transition-all duration-300 relative ${
        isCommentsOpen ? "w-80 opacity-100" : "w-0 opacity-0 pointer-events-none"
      }`}
    >
      {/* Header info */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          Comments logs
        </h3>
        
        <button
          onClick={() => setIsCommentsOpen(false)}
          className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center cursor-pointer"
          title="Collapse sidebar"
        >
          <ChevronsRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Scrollable feed content list */}
      <div className="flex-1 p-4 overflow-y-auto space-y-5">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-1.5 animate-fadeIn group">
            
            {/* Top user profile bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Round user icon */}
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                  {comment.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800 leading-tight">
                    {comment.author}
                  </h4>
                  <span className="text-[9px] text-gray-400 block font-medium">
                    {comment.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Comment Bubble text box content */}
            <div className={`p-3 rounded-xl text-xs leading-relaxed shadow-sm border ${
              comment.isTagged 
                ? "bg-indigo-50/70 border-indigo-100/80 text-indigo-950 font-medium" 
                : "bg-gray-50/50 border-gray-100 text-gray-600"
            }`}>
              {comment.content.includes("@AbhaySalvi") ? (
                <span>
                  <span className="text-indigo-600 font-bold hover:underline cursor-pointer">@AbhaySalvi</span>
                  {comment.content.replace("@AbhaySalvi", "")}
                </span>
              ) : (
                comment.content
              )}
            </div>

            {/* Bottom timestamp */}
            <div className="text-[9px] text-gray-400 font-semibold px-1 select-none">
              {comment.timestamp}
            </div>

          </div>
        ))}
      </div>

      {/* Text input form block at bottom */}
      <form
        onSubmit={onAddComment}
        className="p-4 border-t border-gray-100 bg-white shrink-0"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Share details or tag officer..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-3 pr-10 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center cursor-pointer transition-colors shadow shadow-indigo-600/20"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

    </aside>
  );
}
