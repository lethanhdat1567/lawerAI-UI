"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AssistantContentHeaderProps {
  isGuest: boolean;
  isSidebarOpen: boolean;
  selectedConversationTitle: string | null;
  onToggleSidebar: () => void;
}

export function AssistantContentHeader({
  isGuest,
  isSidebarOpen,
  selectedConversationTitle,
  onToggleSidebar,
}: AssistantContentHeaderProps) {
  return (
    <div className="flex items-center gap-3 border-b border-black/5 px-4 py-3 dark:border-white/10">
      {!isSidebarOpen ? (
        <Button
          aria-label="Mở sidebar"
          className="rounded-none border-black/5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-slate-100"
          size="icon-sm"
          variant="outline"
          onClick={onToggleSidebar}
        >
          <Menu className="size-4" />
        </Button>
      ) : null}

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
          {selectedConversationTitle ?? "Cuộc hội thoại mới"}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isGuest
            ? "Bạn chưa đăng nhập nên lịch sử hội thoại sẽ không được đồng bộ."
            : "Hội thoại đang được đồng bộ thời gian thực với backend."}
        </p>
      </div>
    </div>
  );
}
