"use client";

import Link from "next/link";
import {
  LogInIcon,
  LogOutIcon,
  PlusIcon,
  SettingsIcon,
  SparklesIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { displayTitle } from "@/lib/assistant/queries";
import type { AssistantConversationListItem } from "@/lib/assistant/types";
import { cn } from "@/lib/utils";
import { useAssistantSessionStore } from "@/stores/assistant-session-store";

export interface AssistantSidebarContentProps {
  conversations: AssistantConversationListItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  canInteract: boolean;
  onNavigate?: () => void;
}

export function AssistantSidebarContent({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  canInteract,
  onNavigate,
}: AssistantSidebarContentProps) {
  const isDemoLoggedIn = useAssistantSessionStore((s) => s.isDemoLoggedIn);
  const setDemoLoggedIn = useAssistantSessionStore((s) => s.setDemoLoggedIn);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border p-3">
        <Button
          type="button"
          onClick={() => {
            onNewChat();
            onNavigate?.();
          }}
          className="h-10 flex-1 justify-start gap-2 rounded-none border border-border bg-secondary px-3 text-sm font-medium text-secondary-foreground hover:bg-muted"
        >
          <PlusIcon className="size-4 shrink-0" />
          Cuộc trò chuyện mới
        </Button>
      </div>

      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <SparklesIcon className="size-4 text-muted-foreground" aria-hidden />
        <span className="text-xs font-medium text-muted-foreground">Nội dung của tôi</span>
        <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground">
          Sau
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Cuộc trò chuyện</p>
        {!canInteract ? (
          <p className="px-2 text-sm leading-relaxed text-muted-foreground">
            Tra cứu thử không cần đăng nhập.{" "}
            <Link href="/register" className="text-primary hover:underline">
              Đăng ký
            </Link>{" "}
            /{" "}
            <Link href="/login" className="text-primary hover:underline">
              Đăng nhập
            </Link>{" "}
            hoặc bật demo để lưu và xem danh sách lịch sử nhiều cuộc.
          </p>
        ) : conversations.length === 0 ? (
          <p className="px-2 text-sm text-muted-foreground">Chưa có cuộc trò chuyện.</p>
        ) : (
          <ul className="space-y-1">
            {conversations.map((c) => {
              const active = c.id === activeId;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(c.id);
                      onNavigate?.();
                    }}
                    className={cn(
                      "w-full rounded-none px-3 py-2.5 text-left text-sm transition-colors",
                      active
                        ? "bg-primary/20 text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <span className="line-clamp-2">{displayTitle(c)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-border p-3">
        <Button
          type="button"
          variant="ghost"
          disabled
          className="mb-2 h-9 w-full justify-start gap-2 px-2 text-muted-foreground"
        >
          <SettingsIcon className="size-4" />
          Cài đặt và trợ giúp
        </Button>
        <div className="rounded-none border border-border bg-muted/50 p-2">
          <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Chế độ demo
          </p>
          {isDemoLoggedIn ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex w-full items-center justify-center gap-2 border-border bg-transparent text-foreground"
              onClick={() => setDemoLoggedIn(false)}
            >
              <LogOutIcon className="size-3.5" />
              Đăng xuất demo
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex w-full items-center justify-center gap-2 border-border bg-transparent text-foreground"
              onClick={() => setDemoLoggedIn(true)}
            >
              <LogInIcon className="size-3.5" />
              Đăng nhập demo
            </Button>
          )}
          <Link
            href="/login"
            className="mt-2 block text-center text-xs text-primary hover:underline"
          >
            Đăng nhập thật
          </Link>
        </div>
      </div>
    </div>
  );
}
