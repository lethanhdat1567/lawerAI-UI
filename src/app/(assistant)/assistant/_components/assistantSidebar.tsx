"use client";

import { MessageSquarePlus, Search, SidebarClose, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { AssistantGuestNotice } from "./assistantGuestNotice";
import { AssistantSidebarConversationSection } from "./assistantSidebarConversationSection";
import { AssistantSidebarDeleteDialog } from "./assistantSidebarDeleteDialog";
import { AssistantSidebarFooter } from "./assistantSidebarFooter";
import type { AssistantSidebarProps } from "./assistantSidebar.types";

export function AssistantSidebar({
  authMode,
  conversations,
  isCreatingConversation,
  isHydrated,
  isLoadingConversations,
  isOpen,
  onCreateConversation,
  onDeleteConversation,
  onRenameConversation,
  processingConversationId,
  searchValue,
  selectedConversationId,
  onSearchChange,
  onSelectConversation,
  sessionsError,
  onToggleSidebar,
}: AssistantSidebarProps) {
  const isGuest = authMode === "guest";
  const [editingConversationId, setEditingConversationId] = useState<string | null>(
    null,
  );
  const [deleteConversationId, setDeleteConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setEditingConversationId(null);
      setDeleteConversationId(null);
    }
  }, [isOpen]);

  const deleteConversation = conversations.find(
    (conversation) => conversation.id === deleteConversationId,
  );

  return (
    <>
      <aside
        className={cn(
          "flex h-screen shrink-0 flex-col border-r border-black/5 bg-slate-50 transition-all duration-200 dark:border-white/10 dark:bg-[oklch(0.12_0.01_285)]",
          isOpen ? "w-[296px]" : "w-0 overflow-hidden border-r-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-4 py-3 dark:border-white/10">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Sparkles className="size-4" />
              <p className="truncate text-sm font-semibold">LawerAI Assistant</p>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Không gian hội thoại tối giản
            </p>
          </div>

          <Button
            aria-label="Đóng sidebar"
            className="rounded-none border border-transparent text-slate-500 hover:border-black/5 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-slate-100"
            size="icon-sm"
            variant="ghost"
            onClick={onToggleSidebar}
          >
            <SidebarClose className="size-4" />
          </Button>
        </div>

        <div className="space-y-3 border-b border-black/5 px-4 py-3 dark:border-white/10">
          <Button
            className="h-10 w-full justify-start rounded-none border border-black/5 bg-white text-slate-900 shadow-none hover:bg-slate-100 dark:border-white/10 dark:bg-white/4 dark:text-slate-100 dark:hover:bg-white/8"
            disabled={!isHydrated || isGuest || isCreatingConversation}
            onClick={onCreateConversation}
          >
            <MessageSquarePlus className="size-4" />
            {isCreatingConversation ? "Đang tạo hội thoại..." : "New Chat"}
          </Button>

          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              disabled={!isHydrated || isGuest}
              className="h-10 rounded-none border-black/5 bg-white pl-9 text-slate-700 placeholder:text-slate-400 dark:border-white/10 dark:bg-white/4 dark:text-slate-200 dark:placeholder:text-slate-500"
              placeholder="Tìm kiếm cuộc hội thoại"
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          {!isHydrated ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Đang kiểm tra trạng thái đăng nhập...
            </p>
          ) : null}

          {sessionsError ? (
            <p className="text-xs text-red-500 dark:text-red-400">{sessionsError}</p>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {isGuest ? (
            <div className="mb-3">
              <AssistantGuestNotice />
            </div>
          ) : null}

          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Cuộc trò chuyện
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{conversations.length}</p>
          </div>

          <AssistantSidebarConversationSection
            conversations={conversations}
            deleteConversationId={deleteConversationId}
            editingConversationId={editingConversationId}
            isGuest={isGuest}
            isHydrated={isHydrated}
            isLoading={isHydrated && isLoadingConversations}
            processingConversationId={processingConversationId}
            selectedConversationId={selectedConversationId}
            onCancelRename={() => setEditingConversationId(null)}
            onConfirmDelete={setDeleteConversationId}
            onRenameConversation={onRenameConversation}
            onSelectConversation={onSelectConversation}
            onStartRename={(conversationId) => {
              setDeleteConversationId(null);
              setEditingConversationId(conversationId);
            }}
          />
        </div>

        <AssistantSidebarFooter />
      </aside>

      <AssistantSidebarDeleteDialog
        conversationTitle={deleteConversation?.title}
        isOpen={deleteConversationId !== null}
        onConfirm={() => {
          if (deleteConversationId) {
            onDeleteConversation(deleteConversationId);
          }
          setDeleteConversationId(null);
        }}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConversationId(null);
          }
        }}
      />
    </>
  );
}
