// src/components/auth/auth-split-layout.tsx
import type { ReactNode } from "react";

import { AuthTopBar } from "@/components/auth/auth-top-bar";

interface AuthSplitLayoutProps {
  children: ReactNode;
}

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AuthTopBar />
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-10">
        {children}
      </main>
    </div>
  );
}
