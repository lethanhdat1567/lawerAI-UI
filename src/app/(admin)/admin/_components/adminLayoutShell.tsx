// src/app/(admin)/admin/_components/adminLayoutShell.tsx
"use client";

import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/themeToggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AdminAppSidebar } from "./adminAppSidebar";

interface AdminLayoutShellProps {
  children: ReactNode;
}

export function AdminLayoutShell({ children }: AdminLayoutShellProps) {
  return (
    <SidebarProvider>
      <AdminAppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-full" />
          <span className="text-sm font-medium text-muted-foreground">
            Bảng điều khiển quản trị
          </span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
