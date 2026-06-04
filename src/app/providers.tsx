"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import ToastProvider from "@/components/ToastProvider";
import { QueryProvider } from "./lib/query.provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
        <ToastProvider />
      </QueryProvider>
    </SessionProvider>
  );
}
