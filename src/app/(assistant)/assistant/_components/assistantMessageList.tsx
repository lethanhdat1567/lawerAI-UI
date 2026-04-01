"use client";

import { Sparkles } from "lucide-react";

import { AssistantMarkdownBlock } from "@/app/(assistant)/assistant/_components/assistantMarkdownBlock";
import type { AssistantMessageItem } from "@/app/(assistant)/assistant/_components/assistantContent.types";
import { cn } from "@/lib/utils";

interface AssistantMessageListProps {
  isSendingMessage: boolean;
  messages: AssistantMessageItem[];
}

export function AssistantMessageList({
  isSendingMessage,
  messages,
}: AssistantMessageListProps) {
  return (
    <div className="pb-8 sm:space-y-4">
      {messages.map((message, index) => (
        <AssistantMessageBlock
          key={message.id}
          isLast={index === messages.length - 1}
          isStreaming={isSendingMessage}
          message={message}
        />
      ))}
    </div>
  );
}

interface AssistantMessageBlockProps {
  isLast: boolean;
  isStreaming: boolean;
  message: AssistantMessageItem;
}

function AssistantMessageBlock({
  isLast,
  isStreaming,
  message,
}: AssistantMessageBlockProps) {
  const isUserMessage = message.role === "user";
  const isAssistantMessage = message.role === "assistant";
  const showStreamingCursor =
    isAssistantMessage && isLast && isStreaming && message.content.length >= 0;

  return (
    <article
      className={cn(
        "pb-10",
        isUserMessage
          ? "ml-auto mr-0 w-full max-w-[calc(100%-4rem)] sm:mr-8 sm:max-w-[calc(100%-6rem)]"
          : "max-w-3xl",
      )}
    >
      {isUserMessage ? (
        <div className="border border-black/5 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/3">
          <div className="whitespace-pre-wrap text-sm leading-7 text-slate-800 dark:text-slate-200">
            {message.content}
          </div>
        </div>
      ) : (
        <div className="flex max-w-3xl items-start gap-3">
          <div className="mt-1 flex size-8 shrink-0 items-center justify-center border border-black/5 bg-white text-slate-500 dark:border-white/10 dark:bg-white/3 dark:text-slate-400">
            <Sparkles className="size-3.5" />
          </div>
          <AssistantMarkdownBlock
            content={message.content}
            showStreamingCursor={showStreamingCursor}
          />
        </div>
      )}
    </article>
  );
}
