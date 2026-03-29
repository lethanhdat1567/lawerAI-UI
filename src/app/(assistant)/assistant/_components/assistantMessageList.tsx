"use client";

import type { AssistantMessageDto } from "@/lib/assistant/types";

import { AssistantMessageBubble } from "./assistantMessageBubble";

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
        <AssistantMessageBubble key={m.id} message={m} />
      ))}
    </div>
  );
}
