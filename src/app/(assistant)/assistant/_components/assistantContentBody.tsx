"use client";

import { useEffect, useMemo, useRef } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

import { AssistantContentState } from "@/app/(assistant)/assistant/_components/assistantContentState";
import { AssistantMessageList } from "@/app/(assistant)/assistant/_components/assistantMessageList";
import type { AssistantContentProps } from "@/app/(assistant)/assistant/_components/assistantContent.types";

type AssistantContentBodyProps = Pick<
  AssistantContentProps,
  | "authMode"
  | "isLoadingSessionDetail"
  | "isSendingMessage"
  | "messages"
  | "selectedConversationId"
  | "sessionDetailError"
>;

export function AssistantContentBody({
  authMode,
  isLoadingSessionDetail,
  isSendingMessage,
  messages,
  selectedConversationId,
  sessionDetailError,
}: AssistantContentBodyProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const latestMessageKey = useMemo(() => {
    const latestMessage = messages.at(-1);

    if (!latestMessage) {
      return "empty";
    }

    return `${latestMessage.id}:${latestMessage.content.length}`;
  }, [messages]);

  useEffect(() => {
    if (!selectedConversationId || !messages.length) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: isSendingMessage ? "smooth" : "auto",
        block: "end",
      });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [
    isSendingMessage,
    latestMessageKey,
    messages.length,
    selectedConversationId,
  ]);

  return (
    <ScrollArea className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
      <div className="mx-auto flex w-full max-w-4xl flex-col px-6 py-10 sm:px-8 sm:py-12">
        {!selectedConversationId ? (
          <AssistantContentState
            description={
              authMode === "guest"
                ? "Hãy nhập câu hỏi đầu tiên để bắt đầu dùng thử LawerAI."
                : "Hãy chọn một hội thoại trong sidebar hoặc tạo cuộc hội thoại mới để bắt đầu."
            }
            title={
              authMode === "guest"
                ? "Sẵn sàng trò chuyện cùng AI"
                : "Chưa có hội thoại được chọn"
            }
          />
        ) : isLoadingSessionDetail ? (
          <AssistantContentState
            description="Đang tải lịch sử tin nhắn của hội thoại này."
            title="Đang tải nội dung hội thoại"
          />
        ) : sessionDetailError ? (
          <AssistantContentState
            description={sessionDetailError}
            title="Không tải được nội dung hội thoại"
          />
        ) : !messages.length ? (
          <AssistantContentState
            description="Hãy gửi câu hỏi đầu tiên để bắt đầu cuộc trò chuyện này."
            title="Chưa có tin nhắn nào"
          />
        ) : (
          <AssistantMessageList
            isSendingMessage={isSendingMessage}
            messages={messages}
          />
        )}
        <div ref={messagesEndRef} aria-hidden="true" />
      </div>
    </ScrollArea>
  );
}
