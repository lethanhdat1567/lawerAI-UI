// src/components/assistant/assistant-chat-header.tsx
"use client";

import Link from "next/link";
import { MenuIcon, MoreVerticalIcon, Share2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteName } from "@/lib/site-config";
import { cn } from "@/lib/utils";

interface AssistantChatHeaderProps {
  conversationTitle: string;
  isDemoLoggedIn: boolean;
  onOpenSidebar: () => void;
}

export function AssistantChatHeader({
  conversationTitle,
  isDemoLoggedIn,
  onOpenSidebar,
}: AssistantChatHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 md:px-4">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={onOpenSidebar}
        aria-label="Mở cuộc trò chuyện"
      >
        <MenuIcon className="size-5" />
      </Button>
      <Link
        href="/"
        className="hidden shrink-0 font-heading text-sm font-extrabold tracking-tight text-foreground md:inline"
      >
        {siteName.toUpperCase()}
      </Link>
      <h1 className="min-w-0 flex-1 truncate text-center text-sm font-medium text-foreground/90 md:text-left">
        {conversationTitle}
      </h1>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled
          className="hidden text-muted-foreground sm:inline-flex"
          aria-label="Chia sẻ (sau)"
        >
          <Share2Icon className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled
          className="hidden text-muted-foreground md:inline-flex"
          aria-label="Thêm tùy chọn"
        >
          <MoreVerticalIcon className="size-4" />
        </Button>
        {isDemoLoggedIn ? (
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-foreground",
            )}
            title="Demo đã đăng nhập"
          >
            LA
          </span>
        ) : (
          <Link
            href="/login"
            className="rounded-full border border-border bg-transparent px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
          >
            Đăng nhập
          </Link>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
