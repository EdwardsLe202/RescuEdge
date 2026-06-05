"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import ToastProvider from "@/components/ToastProvider";
import { QueryProvider } from "./lib/query.provider";
import { LanguageProvider } from "@/hooks/useLanguage";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <LanguageProvider>
          {children}
          <ToastProvider />
        </LanguageProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
