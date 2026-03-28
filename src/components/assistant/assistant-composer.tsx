// src/components/assistant/assistant-composer.tsx
"use client";

import Link from "next/link";
import { MicIcon, PlusIcon, SendHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AssistantComposerProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  placeholder?: string;
  showLoginHint: boolean;
}

export function AssistantComposer({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = "Mô tả tình huống pháp lý cần tra cứu…",
  showLoginHint,
}: AssistantComposerProps) {
  const locked = disabled;

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!locked && value.trim()) onSubmit();
    }
  }

  return (
    <div className="shrink-0 border-t border-border bg-background/95 px-3 py-3 backdrop-blur-sm md:px-6">
      <div
        className={cn(
          "mx-auto max-w-3xl rounded-[28px] border border-border bg-card px-3 py-2 shadow-lg backdrop-blur-sm md:px-4 md:py-3",
          locked && "opacity-80",
        )}
      >
        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled
            className="shrink-0 text-muted-foreground"
            aria-label="Đính kèm (sau)"
          >
            <PlusIcon className="size-5" />
          </Button>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={locked}
            rows={1}
            className={cn(
              "max-h-40 min-h-[44px] flex-1 resize-none bg-transparent py-2.5 text-[0.9375rem] leading-relaxed text-foreground placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed",
            )}
            aria-label="Nhập câu hỏi tra cứu"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled
            className="shrink-0 text-muted-foreground"
            aria-label="Giọng nói (sau)"
          >
            <MicIcon className="size-5" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            disabled={locked || !value.trim()}
            onClick={() => onSubmit()}
            className="shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            aria-label="Gửi"
          >
            <SendHorizontalIcon className="size-5" />
          </Button>
        </div>
      </div>
      {showLoginHint ? (
        <p className="mx-auto mt-2 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
          Bạn có thể tra cứu thử ngay.{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Đăng ký
          </Link>{" "}
          hoặc{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            đăng nhập
          </Link>{" "}
          để lưu và xem lịch sử nhiều cuộc trò chuyện (hoặc bật demo ở cuối sidebar).
        </p>
      ) : null}
      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] leading-relaxed text-muted-foreground">
        LawyerAI là công cụ tra cứu; kết quả có thể sai — không thay thế tư vấn luật sư.
      </p>
    </div>
  );
}
