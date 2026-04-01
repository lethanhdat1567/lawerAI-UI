"use client";

import { HelpCircle, History, Settings2 } from "lucide-react";

import { ThemeMenuItems } from "@/components/themeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import type { AssistantSidebarFooterProps } from "./assistantSidebar.types";

export function AssistantSidebarFooter({
  isHistoryActive = true,
}: AssistantSidebarFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-black/5 px-3 py-3 dark:border-white/10">
      <Button
        aria-label="Lịch sử"
        className={cn(
          "rounded-none border border-transparent bg-transparent text-slate-500 shadow-none hover:border-black/5 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-slate-100",
          isHistoryActive
            ? "border-black/5 bg-white text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
            : "",
        )}
        size="icon-sm"
        title="Lịch sử"
        variant="ghost"
      >
        <History className="size-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              aria-label="Cài đặt"
              className="rounded-none border border-transparent bg-transparent text-slate-500 shadow-none hover:border-black/5 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-slate-100"
              size="icon-sm"
              title="Cài đặt"
              variant="ghost"
            />
          }
        >
          <Settings2 className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-44 rounded-none border border-black/5 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-[oklch(0.16_0.01_285)]"
        >
          <DropdownMenuLabel className="px-2 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
            Giao diện
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-black/5 dark:bg-white/10" />
          <ThemeMenuItems className="text-slate-600 dark:text-slate-300 dark:focus:bg-white/6 dark:focus:text-slate-100" />
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        aria-label="Trợ giúp"
        className="rounded-none border border-transparent bg-transparent text-slate-500 shadow-none hover:border-black/5 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-slate-100"
        size="icon-sm"
        title="Trợ giúp"
        variant="ghost"
      >
        <HelpCircle className="size-4" />
      </Button>
    </div>
  );
}
