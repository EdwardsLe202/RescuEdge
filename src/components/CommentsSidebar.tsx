"use client";

import React from "react";
import { MessageSquare, ChevronsRight, Send } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

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
  const { t } = useLanguage();

  return (
    <aside
      className={`border-l border-slate-200 bg-white flex flex-col justify-between shrink-0 transition-all duration-300 relative ${
        isCommentsOpen ? "w-80 opacity-100" : "w-0 opacity-0 pointer-events-none"
      }`}
    >
      {/* Header info */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 select-none">
        <h3 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-[#004d56]" />
          {t("commentsLogs")}
        </h3>
        
        <button
          onClick={() => setIsCommentsOpen(false)}
          className="w-7 h-7 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors flex items-center justify-center cursor-pointer border-none bg-transparent"
          title={t("collapseSidebar")}
        >
          <ChevronsRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Scrollable feed content list */}
      <div className="flex-1 p-4 overflow-y-auto space-y-5">
        {comments.map((comment) => {
          const isMock = ["1", "2", "3"].includes(comment.id);
          const displayRole = isMock 
            ? (comment.id === "1" ? t("forensicRole") : t("investigationRole"))
            : comment.role;
          const displayContent = isMock
            ? t(`commentContent${comment.id}`)
            : comment.content;
          const displayTimestamp = isMock
            ? t(`commentTime${comment.id}`)
            : comment.timestamp;

          return (
            <div key={comment.id} className="space-y-1.5 animate-fadeIn group">
              
              {/* Top user profile bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Round user icon */}
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100/60 flex items-center justify-center text-xs font-bold text-[#004d56]">
                    {comment.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight font-mono">
                      {comment.author}
                    </h4>
                    <span className="text-[9px] text-slate-400 block font-medium">
                      {displayRole}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment Bubble text box content */}
              <div className={`p-3 rounded-xl text-xs leading-relaxed shadow-sm border ${
                comment.isTagged 
                  ? "bg-emerald-50/70 border-emerald-100/80 text-[#004d56] font-semibold" 
                  : "bg-slate-50/50 border-slate-100 text-slate-600"
              }`}>
                {displayContent.includes("@AbhaySalvi") ? (
                  <span>
                    <span className="text-[#004d56] font-bold hover:underline cursor-pointer">@AbhaySalvi</span>
                    {displayContent.replace("@AbhaySalvi", "")}
                  </span>
                ) : (
                  displayContent
                )}
              </div>

              {/* Bottom timestamp */}
              <div className="text-[9px] text-slate-400 font-semibold px-1 select-none">
                {displayTimestamp}
              </div>

            </div>
          );
        })}
      </div>

      {/* Text input form block at bottom */}
      <form
        onSubmit={onAddComment}
        className="p-4 border-t border-slate-100 bg-white shrink-0"
      >
        <div className="relative">
          <input
            type="text"
            placeholder={t("commentPlaceholder")}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-10 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#004d56] focus:ring-1 focus:ring-[#004d56]/20 transition-all shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#00d084] hover:bg-[#00b372] text-white rounded-lg flex items-center justify-center cursor-pointer transition-colors shadow shadow-emerald-600/20 border-none"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

    </aside>
  );
}
