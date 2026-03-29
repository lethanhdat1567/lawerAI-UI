// src/components/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { AuthProvider } from "@/app/(auth)/_components/authProvider";
import { Toaster } from "@/components/ui/sonner";
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
        <AuthProvider>
          <NuqsAdapter>
            {children}
            <Toaster />
          </NuqsAdapter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
