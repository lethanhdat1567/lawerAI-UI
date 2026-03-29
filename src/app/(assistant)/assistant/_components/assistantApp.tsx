"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { AssistantConversationWithMessages } from "@/lib/assistant/types";
import {
  DEMO_USER_ID,
  GUEST_USER_ID,
  cloneMockConversations,
} from "@/lib/assistant/mock-data";
import {
  appendMessage,
  getConversationById,
  listConversationsFrom,
  makeNewConversation,
} from "@/lib/assistant/queries";
import {
  readAssistantDemoAuthFromStorage,
  useAssistantSessionStore,
} from "@/stores/assistant-session-store";

import { AssistantChatHeader } from "./assistantChatHeader";
import { AssistantComposer } from "./assistantComposer";
import { AssistantMessageList } from "./assistantMessageList";
import { AssistantSidebarContent } from "./assistantSidebar";

export function AssistantApp() {
  const isDemoLoggedIn = useAssistantSessionStore((s) => s.isDemoLoggedIn);
  const hydrated = useAssistantSessionStore((s) => s.hydrated);
  const setHydrated = useAssistantSessionStore((s) => s.setHydrated);

  const [conversations, setConversations] = useState<
    AssistantConversationWithMessages[]
  >([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [composerText, setComposerText] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const v = readAssistantDemoAuthFromStorage();
    useAssistantSessionStore.setState({ isDemoLoggedIn: v });
    setHydrated(true);
  }, [setHydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (isDemoLoggedIn) {
      const seed = cloneMockConversations();
      setConversations(seed);
      setActiveId(seed[0]?.id ?? null);
    } else {
      const g = makeNewConversation(GUEST_USER_ID);
      setConversations([g]);
      setActiveId(g.id);
    }
  }, [isDemoLoggedIn, hydrated]);

  const listItems = useMemo(
    () => listConversationsFrom(conversations),
    [conversations],
  );

  const sidebarListItems = useMemo(
    () => (isDemoLoggedIn ? listItems : []),
    [isDemoLoggedIn, listItems],
  );

  const activeConversation = useMemo(() => {
    if (!activeId) return undefined;
    return getConversationById(conversations, activeId);
  }, [activeId, conversations]);

  const headerTitle = activeConversation
    ? listItems.find((x) => x.id === activeId)?.title
      ? listItems.find((x) => x.id === activeId)!.title!
      : activeConversation.title || "Cuộc trò chuyện mới"
    : "Trợ lý tra cứu";

  const displayHeaderTitle =
    activeConversation &&
    !activeConversation.title &&
    activeConversation.messages.length === 0
      ? "Cuộc trò chuyện mới"
      : typeof headerTitle === "string" && headerTitle.trim()
        ? headerTitle
        : "Trợ lý tra cứu";

  const onNewChat = useCallback(() => {
    if (isDemoLoggedIn) {
      const next = makeNewConversation(DEMO_USER_ID);
      setConversations((prev) => [next, ...prev]);
      setActiveId(next.id);
      return;
    }
    const next = makeNewConversation(GUEST_USER_ID);
    setConversations([next]);
    setActiveId(next.id);
  }, [isDemoLoggedIn]);

  const onSelect = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const sendMessage = useCallback(() => {
    if (!activeId || !composerText.trim()) return;
    const text = composerText.trim();
    setComposerText("");

    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === activeId);
      if (idx < 0) return prev;
      let conv = prev[idx];
      conv = appendMessage(conv, {
        role: "USER",
        content: text,
      });
      const next = [...prev];
      next[idx] = conv;
      return next;
    });

    window.setTimeout(() => {
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c.id === activeId);
        if (idx < 0) return prev;
        const conv = appendMessage(prev[idx], {
          role: "ASSISTANT",
          content:
            "Đây là **phản hồi minh hoạ** (chưa gọi RAG/API). Khi backend sẵn sàng, nội dung sẽ kèm trích dẫn điều luật và nguồn corpus.\n\nVui lòng đối chiếu văn bản pháp luật hiện hành và hỏi luật sư nếu có tranh chấp.",
        });
        const next = [...prev];
        next[idx] = conv;
        return next;
      });
    }, 600);
  }, [activeId, composerText]);

  const sidebarProps = {
    conversations: sidebarListItems,
    activeId,
    onSelect,
    onNewChat,
    canInteract: isDemoLoggedIn,
  };

  return (
    <div className="flex h-dvh overflow-hidden">
      <aside className="hidden w-[280px] shrink-0 flex-col border-r border-border bg-sidebar md:flex">
        <AssistantSidebarContent {...sidebarProps} />
      </aside>

      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[min(100%,280px)] gap-0 border-border bg-sidebar p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Cuộc trò chuyện</SheetTitle>
          </SheetHeader>
          <AssistantSidebarContent
            {...sidebarProps}
            onNavigate={() => setMobileSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <AssistantChatHeader
          conversationTitle={displayHeaderTitle}
          isDemoLoggedIn={isDemoLoggedIn}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
        />
        <AssistantMessageList messages={activeConversation?.messages ?? []} />
        <AssistantComposer
          value={composerText}
          onChange={setComposerText}
          onSubmit={sendMessage}
          disabled={!activeId}
          showLoginHint={hydrated && !isDemoLoggedIn}
        />
      </div>
    </div>
  );
}
