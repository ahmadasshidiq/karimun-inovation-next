"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "@/components/ui/toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Toaster>{children}</Toaster>
    </ThemeProvider>
  );
}
