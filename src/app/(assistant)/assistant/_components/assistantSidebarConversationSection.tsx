"use client";

import { AssistantSidebarConversationItem } from "./assistantSidebarConversationItem";
import { AssistantSidebarState } from "./assistantSidebarState";
import type { AssistantSidebarConversationSectionProps } from "./assistantSidebar.types";

export function AssistantSidebarConversationSection({
  conversations,
  deleteConversationId,
  editingConversationId,
  isGuest,
  isHydrated,
  isLoading,
  processingConversationId,
  selectedConversationId,
  onCancelRename,
  onConfirmDelete,
  onRenameConversation,
  onSelectConversation,
  onStartRename,
}: AssistantSidebarConversationSectionProps) {
  if (!isHydrated) {
    return <AssistantSidebarState description="Đang chuẩn bị không gian hội thoại..." />;
  }

  if (isGuest) {
    return (
      <AssistantSidebarState description="Chế độ khách không lưu lịch sử. Đăng nhập để xem và quản lý các hội thoại đã lưu." />
    );
  }

  if (isLoading) {
    return <AssistantSidebarState description="Đang tải lịch sử hội thoại..." />;
  }

  if (!conversations.length) {
    return <AssistantSidebarState description="Chưa có cuộc hội thoại nào phù hợp để hiển thị." />;
  }

  return (
    <div className="space-y-1">
      {conversations.map((conversation) => (
        <AssistantSidebarConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === selectedConversationId}
          isDeleteOpen={conversation.id === deleteConversationId}
          isEditing={conversation.id === editingConversationId}
          isProcessing={conversation.id === processingConversationId}
          onCancelRename={onCancelRename}
          onConfirmDelete={onConfirmDelete}
          onRenameConversation={onRenameConversation}
          onSelectConversation={onSelectConversation}
          onStartRename={onStartRename}
        />
      ))}
    </div>
  );
}
