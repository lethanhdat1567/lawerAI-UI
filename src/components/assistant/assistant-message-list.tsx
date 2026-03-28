// src/components/assistant/assistant-message-list.tsx
"use client";

import type { AssistantMessageDto } from "@/lib/assistant/types";
import { ArticleBody } from "@/components/article/article-body";
import { cn } from "@/lib/utils";

import { AssistantRatingRow } from "@/components/assistant/assistant-rating-row";

interface AssistantMessageListProps {
  messages: AssistantMessageDto[];
}

export function AssistantMessageList({ messages }: AssistantMessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
        <p className="font-heading text-lg font-semibold text-foreground">
          Trợ lý tra cứu LawyerAI
        </p>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Mô tả tình huống để nhận gợi ý điều luật và hướng đọc (RAG khi có API). Đây là
          giao diện minh hoạ.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6 md:px-8">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
    </div>
  );
}

function MessageBubble({ message }: { message: AssistantMessageDto }) {
  if (message.role === "SYSTEM") {
    return (
      <div className="flex justify-center">
        <p className="max-w-2xl rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs italic text-amber-950 dark:text-amber-200/90">
          {message.content}
        </p>
      </div>
    );
  }

  const isUser = message.role === "USER";

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[min(100%,42rem)] rounded-2xl px-4 py-3 text-[0.9375rem] leading-relaxed",
          isUser
            ? "bg-primary/18 text-foreground dark:bg-sky-600/25 dark:text-zinc-100"
            : "border border-border bg-card text-card-foreground",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <>
            <ArticleBody body={message.content} />
            <AssistantRatingRow />
          </>
        )}
      </div>
    </div>
  );
}
