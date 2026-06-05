"use client";

import React, { useEffect, useRef } from "react";
import { MessageSquare, ChevronsRight, Send, X } from "lucide-react";
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll when bottom sheet is open on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && isCommentsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCommentsOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isCommentsOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isCommentsOpen]);

  const panelContent = (
    <>
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 select-none">
        <h3 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-[#004d56]" />
          {t("commentsLogs")}
        </h3>

        {/* Desktop close button */}
        <button
          onClick={() => setIsCommentsOpen(false)}
          className="hidden md:flex w-7 h-7 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors items-center justify-center cursor-pointer border-none bg-transparent"
          title={t("collapseSidebar")}
        >
          <ChevronsRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Mobile close button */}
        <button
          onClick={() => setIsCommentsOpen(false)}
          className="flex md:hidden w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors items-center justify-center cursor-pointer border-none bg-transparent"
          title="Đóng"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable comment list */}
      <div className="flex-1 p-4 overflow-y-auto space-y-5 flex flex-col">
        {comments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <span className="text-2xl mb-2 text-slate-300 select-none">💬</span>
            <p className="text-xs text-slate-400 font-medium">{t("noCommentsYet")}</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-1.5 animate-fadeIn group">
              {/* Top user profile bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100/60 flex items-center justify-center text-xs font-bold text-[#004d56]">
                    {comment.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight font-mono">
                      {comment.author}
                    </h4>
                    <span className="text-[9px] text-slate-400 block font-medium">
                      {comment.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment bubble */}
              <div
                className={`p-3 rounded-xl text-xs leading-relaxed shadow-sm border ${
                  comment.isTagged
                    ? "bg-emerald-50/70 border-emerald-100/80 text-[#004d56] font-semibold"
                    : "bg-slate-50/50 border-slate-100 text-slate-600"
                }`}
              >
                {comment.content}
              </div>

              {/* Timestamp */}
              <div className="text-[9px] text-slate-400 font-semibold px-1 select-none">
                {comment.timestamp}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input form */}
      <form
        onSubmit={onAddComment}
        className="p-4 border-t border-slate-100 bg-white shrink-0"
      >
        <div className="relative">
          <input
            ref={inputRef}
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
    </>
  );

  return (
    <>
      {/* ===== DESKTOP: Sidebar (md and up) ===== */}
      <aside
        className={`hidden md:flex border-l border-slate-200 bg-white flex-col justify-between shrink-0 transition-all duration-300 relative ${
          isCommentsOpen ? "w-80 opacity-100" : "w-0 opacity-0 pointer-events-none"
        }`}
      >
        {panelContent}
      </aside>

      {/* ===== MOBILE: Bottom Sheet (below md) ===== */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 md:hidden transition-opacity duration-300 ${
          isCommentsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCommentsOpen(false)}
        aria-hidden="true"
      />

      {/* Sheet panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isCommentsOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "80dvh", minHeight: "50dvh" }}
        role="dialog"
        aria-modal="true"
        aria-label={t("commentsLogs")}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {panelContent}
      </div>
    </>
  );
}
