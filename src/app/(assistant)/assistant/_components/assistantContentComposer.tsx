"use client";

import { SendHorizontal } from "lucide-react";
import type { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

import type { AssistantContentProps } from "@/app/(assistant)/assistant/_components/assistantContent.types";

type AssistantContentComposerProps = Pick<
  AssistantContentProps,
  | "authMode"
  | "composerValue"
  | "isLoadingSessionDetail"
  | "isSendingMessage"
  | "selectedConversationId"
  | "onComposerChange"
  | "onSendMessage"
>;

const MAX_TEXTAREA_HEIGHT_DESKTOP = 200;
const MAX_TEXTAREA_HEIGHT_MOBILE = 128;

function getComposerMaxHeightPx() {
  if (typeof window === "undefined") {
    return MAX_TEXTAREA_HEIGHT_DESKTOP;
  }

  return window.matchMedia("(max-width: 639px)").matches
    ? MAX_TEXTAREA_HEIGHT_MOBILE
    : MAX_TEXTAREA_HEIGHT_DESKTOP;
}

export function AssistantContentComposer({
  authMode,
  composerValue,
  isLoadingSessionDetail,
  isSendingMessage,
  selectedConversationId,
  onComposerChange,
  onSendMessage,
}: AssistantContentComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isGuest = authMode === "guest";
  const isComposerDisabled =
    !selectedConversationId ||
    isLoadingSessionDetail ||
    isSendingMessage;
  const isSubmitDisabled = isComposerDisabled || !composerValue.trim();

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const maxHeight = getComposerMaxHeightPx();

    textarea.style.height = "0px";

    const nextHeight = Math.min(textarea.scrollHeight, maxHeight);

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [composerValue]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSendMessage();
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onComposerChange(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    onSendMessage();
  };

  return (
    <div className="shrink-0 border-black/5 bg-background/95 px-3 py-2 backdrop-blur-sm dark:border-white/10 sm:px-4 sm:py-3">
      <form
        className="mx-auto flex w-full max-w-4xl flex-col gap-1.5 sm:gap-2"
        onSubmit={handleSubmit}
      >
        <div className="border border-black/5 bg-white dark:border-white/10 dark:bg-white/3">
          <textarea
            ref={textareaRef}
            rows={1}
            className="max-h-32 min-h-12 w-full resize-none overflow-y-hidden rounded-none border-0 bg-transparent px-3 py-2 text-[13px] leading-6 text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 sm:max-h-[200px] sm:min-h-16 sm:px-4 sm:py-3 sm:text-sm sm:leading-7 dark:text-slate-200 dark:placeholder:text-slate-500"
            disabled={isComposerDisabled}
            placeholder={
              isGuest
                ? "Nhập câu hỏi để dùng thử AI. Đăng nhập để lưu lịch sử hội thoại."
                : "Nhập câu hỏi pháp lý của bạn..."
            }
            value={composerValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex justify-end">
          <Button
            className="h-8 rounded-none border border-black/5 bg-slate-900 px-2.5 text-xs text-white shadow-none hover:bg-slate-800 sm:h-9 sm:px-3 sm:text-sm dark:border-white/10 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            disabled={isSubmitDisabled}
            type="submit"
          >
            <SendHorizontal className="size-3.5 sm:size-4" />
            <span className="hidden sm:inline">
              {isSendingMessage ? "Đang gửi..." : "Gửi tin nhắn"}
            </span>
            <span className="sm:hidden">
              {isSendingMessage ? "..." : "Gửi"}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
