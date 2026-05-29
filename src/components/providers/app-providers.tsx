"use client";

import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "10px",
            fontSize: "14px",
          },
        }}
      />
    </ThemeProvider>
  );
}
