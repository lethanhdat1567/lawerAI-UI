"use client";

import { ArticleBody } from "@/components/article/articleBody";
import { cn } from "@/lib/utils";
import type { AssistantMessageDto } from "@/lib/assistant/types";

import { AssistantRatingRow } from "./assistantRatingRow";

interface AssistantMessageBubbleProps {
  message: AssistantMessageDto;
}

export function AssistantMessageBubble({ message }: AssistantMessageBubbleProps) {
  if (message.role === "SYSTEM") {
    return (
      <div className="flex justify-center">
        <p className="max-w-2xl rounded-none border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs italic text-amber-950 dark:text-amber-200/90">
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
          "max-w-[min(100%,42rem)] rounded-none px-4 py-3 text-[0.9375rem] leading-relaxed",
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
