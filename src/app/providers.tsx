"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import ToastProvider from "@/components/ToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ToastProvider />
    </SessionProvider>
  );
}
