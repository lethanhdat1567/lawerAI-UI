// src/components/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { TooltipProvider } from "@/components/ui/tooltip";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      storageKey="lawyerai-theme"
    >
      <TooltipProvider delay={0}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </TooltipProvider>
    </ThemeProvider>
  );
}
