"use client";

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
  const isGuest = authMode === "guest";

  return (
    <ScrollArea className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
      <div className="mx-auto flex w-full max-w-4xl flex-col px-6 py-10 sm:px-8 sm:py-12">
        {isGuest ? (
          <AssistantContentState
            description="Đăng nhập để xem lịch sử hội thoại và tiếp tục trao đổi với AI."
            title="Cần đăng nhập để sử dụng hội thoại đã lưu"
          />
        ) : !selectedConversationId ? (
          <AssistantContentState
            description="Hãy chọn một hội thoại trong sidebar hoặc tạo cuộc hội thoại mới để bắt đầu."
            title="Chưa có hội thoại được chọn"
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
      </div>
    </ScrollArea>
  );
}
