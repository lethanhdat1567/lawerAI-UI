"use client";

import { AssistantContentBody } from "@/app/(assistant)/assistant/_components/assistantContentBody";
import { AssistantContentComposer } from "@/app/(assistant)/assistant/_components/assistantContentComposer";
import { AssistantContentHeader } from "@/app/(assistant)/assistant/_components/assistantContentHeader";
import type { AssistantContentProps } from "@/app/(assistant)/assistant/_components/assistantContent.types";

export function AssistantContent({
  authMode,
  composerValue,
  isLoadingSessionDetail,
  isSidebarOpen,
  isSendingMessage,
  messages,
  selectedConversationId,
  selectedConversationTitle,
  sessionDetailError,
  onComposerChange,
  onSendMessage,
  onToggleSidebar,
}: AssistantContentProps) {
  return (
    <section className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <AssistantContentHeader
        isGuest={authMode === "guest"}
        isSidebarOpen={isSidebarOpen}
        selectedConversationTitle={selectedConversationTitle}
        onToggleSidebar={onToggleSidebar}
      />

      <div className="min-h-0 flex flex-1 flex-col overflow-hidden">
        <AssistantContentBody
          authMode={authMode}
          isLoadingSessionDetail={isLoadingSessionDetail}
          isSendingMessage={isSendingMessage}
          messages={messages}
          selectedConversationId={selectedConversationId}
          sessionDetailError={sessionDetailError}
        />
        <AssistantContentComposer
          authMode={authMode}
          composerValue={composerValue}
          isLoadingSessionDetail={isLoadingSessionDetail}
          isSendingMessage={isSendingMessage}
          selectedConversationId={selectedConversationId}
          onComposerChange={onComposerChange}
          onSendMessage={onSendMessage}
        />
      </div>
    </section>
  );
}
