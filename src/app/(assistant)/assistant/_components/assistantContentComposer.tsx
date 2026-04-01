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

const MAX_TEXTAREA_HEIGHT = 200;

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
    isGuest ||
    !selectedConversationId ||
    isLoadingSessionDetail ||
    isSendingMessage;
  const isSubmitDisabled = isComposerDisabled || !composerValue.trim();

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";

    const nextHeight = Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT);

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > MAX_TEXTAREA_HEIGHT ? "auto" : "hidden";
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
    <div className="shrink-0  border-black/5 bg-background/95 px-4 py-3 backdrop-blur-sm dark:border-white/10">
      <form
        className="mx-auto flex w-full max-w-4xl flex-col gap-2"
        onSubmit={handleSubmit}
      >
        <div className="border border-black/5 bg-white dark:border-white/10 dark:bg-white/3">
          <textarea
            ref={textareaRef}
            className="min-h-16 max-h-50 w-full resize-none overflow-y-hidden rounded-none border-0 bg-transparent px-4 py-3 text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-200 dark:placeholder:text-slate-500"
            disabled={isComposerDisabled}
            placeholder={
              isGuest
                ? "Đăng nhập để bắt đầu trò chuyện"
                : "Nhập câu hỏi pháp lý của bạn..."
            }
            value={composerValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="flex justify-end">
          <Button
            className="h-9 rounded-none border border-black/5 bg-slate-900 px-3 text-white shadow-none hover:bg-slate-800 dark:border-white/10 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            disabled={isSubmitDisabled}
            type="submit"
          >
            <SendHorizontal className="size-4" />
            {isSendingMessage ? "Đang gửi..." : "Gửi tin nhắn"}
          </Button>
        </div>
      </form>
    </div>
  );
}
