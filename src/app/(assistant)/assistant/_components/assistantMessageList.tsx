"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();
  const isUserMessage = message.role === "user";
  const isAssistantMessage = message.role === "assistant";
  const isAssistantStreaming = isAssistantMessage && isLast && isStreaming;
  const showStreamingCursor =
    isAssistantStreaming && message.content.length >= 0;

  const initial = reduceMotion
    ? { opacity: 1, x: 0, y: 0 }
    : isUserMessage
      ? { opacity: 0, x: 14, y: 8 }
      : { opacity: 0, x: -14, y: 8 };

  return (
    <motion.article
      animate={{ opacity: 1, x: 0, y: 0 }}
      className={cn(
        "pb-10",
        isUserMessage
          ? "ml-auto mr-0 w-full max-w-[calc(100%-4rem)] sm:mr-8 sm:max-w-[calc(100%-6rem)]"
          : "max-w-3xl",
      )}
      initial={initial}
      transition={{
        duration: reduceMotion ? 0 : 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {isUserMessage ? (
        <div className="rounded-xl border border-black/5 bg-slate-50 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/6">
          <div className="whitespace-pre-wrap text-xl leading-9 text-slate-800 dark:text-slate-200">
            {message.content}
          </div>
        </div>
      ) : (
        <div className="flex max-w-3xl items-start gap-3">
          <div
            className={cn(
              "mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg border border-black/5 bg-white text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/6 dark:text-slate-400",
              isAssistantStreaming &&
                "ring-2 ring-violet-500/25 dark:ring-violet-400/20",
              isAssistantStreaming && !reduceMotion && "animate-pulse",
            )}
          >
            <Sparkles className="size-3.5" />
          </div>
          <AssistantMarkdownBlock
            content={message.content}
            isStreaming={isAssistantStreaming}
            showStreamingCursor={showStreamingCursor}
          />
        </div>
      )}
    </motion.article>
  );
}
