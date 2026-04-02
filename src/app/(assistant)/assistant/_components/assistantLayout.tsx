"use client";

import { AssistantContent } from "@/app/(assistant)/assistant/_components/assistantContent";
import { AssistantSidebar } from "@/app/(assistant)/assistant/_components/assistantSidebar";
import { useEffect, useMemo, useRef, useState } from "react";

import type {
  ChatAiMessage,
  ChatAiSession,
  ChatAiSessionDetail,
} from "@/services/chat-ai/chatAiTypes";
import { chatAiService } from "@/services/chat-ai/chatAiService";
import { useAuthStore } from "@/stores/auth-store";

const GUEST_SESSION_ID = "guest-local-session";
const GUEST_USER_ID = "guest";

export function AssistantLayout() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const isSignedIn = useAuthStore((state) =>
    Boolean(state.user ?? state.accessToken),
  );
  const userId = useAuthStore((state) => state.user?.id ?? "");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [sessions, setSessions] = useState<ChatAiSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [processingConversationId, setProcessingConversationId] = useState<
    string | null
  >(null);
  const [selectedSessionDetail, setSelectedSessionDetail] =
    useState<ChatAiSessionDetail | null>(null);
  const [isLoadingSessionDetail, setIsLoadingSessionDetail] = useState(false);
  const [sessionDetailError, setSessionDetailError] = useState<string | null>(
    null,
  );
  const [composerValue, setComposerValue] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const selectedConversationIdRef = useRef<string | null>(null);
  const sessionDetailRequestIdRef = useRef(0);

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchValue]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!isSignedIn) {
      setSessions([]);
      setIsLoadingSessions(false);
      setSessionsError(null);
      setIsCreatingSession(false);
      setProcessingConversationId(null);
      setSelectedConversationId(GUEST_SESSION_ID);
      setSelectedSessionDetail((currentDetail) =>
        currentDetail?.id === GUEST_SESSION_ID
          ? currentDetail
          : createGuestSessionDetail(),
      );
      setIsLoadingSessionDetail(false);
      setSessionDetailError(null);
      return;
    }

    setSelectedConversationId(null);
    setSelectedSessionDetail(null);
    setSessionDetailError(null);

    let isCancelled = false;

    const loadSessions = async () => {
      setIsLoadingSessions(true);
      setSessionsError(null);

      try {
        const nextSessions = await chatAiService.getSessions({
          search: debouncedSearchValue,
        });

        if (isCancelled) {
          return;
        }

        setSessions(nextSessions);
        setSelectedConversationId((currentId) => {
          if (
            currentId &&
            nextSessions.some((session) => session.id === currentId)
          ) {
            return currentId;
          }

          return nextSessions[0]?.id ?? null;
        });
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setSessions([]);
        setSelectedConversationId(null);
        setSessionsError(
          error instanceof Error
            ? error.message
            : "Không tải được lịch sử hội thoại.",
        );
      } finally {
        if (!isCancelled) {
          setIsLoadingSessions(false);
        }
      }
    };

    void loadSessions();

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearchValue, hydrated, isSignedIn]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!isSignedIn) {
      setIsLoadingSessionDetail(false);
      setSessionDetailError(null);
      return;
    }

    if (!selectedConversationId) {
      setSelectedSessionDetail(null);
      setSessionDetailError(null);
      setComposerValue("");
      return;
    }

    let isCancelled = false;

    const loadSessionDetail = async () => {
      const requestId = ++sessionDetailRequestIdRef.current;

      setIsLoadingSessionDetail(true);
      setSessionDetailError(null);

      try {
        const nextDetail = await chatAiService.getSessionDetail(
          selectedConversationId,
        );

        if (
          isCancelled ||
          requestId !== sessionDetailRequestIdRef.current ||
          selectedConversationIdRef.current !== selectedConversationId
        ) {
          return;
        }

        setSelectedSessionDetail((currentDetail) =>
          mergeSessionDetail(currentDetail, nextDetail),
        );
      } catch (error) {
        if (
          isCancelled ||
          requestId !== sessionDetailRequestIdRef.current ||
          selectedConversationIdRef.current !== selectedConversationId
        ) {
          return;
        }

        setSelectedSessionDetail(null);
        setSessionDetailError(
          error instanceof Error
            ? error.message
            : "Không tải được nội dung hội thoại.",
        );
      } finally {
        if (!isCancelled) {
          setIsLoadingSessionDetail(false);
        }
      }
    };

    void loadSessionDetail();

    return () => {
      isCancelled = true;
    };
  }, [hydrated, isSignedIn, selectedConversationId]);

  const visibleConversations = useMemo(() => {
    return sessions.map((session) => ({
      id: session.id,
      title: session.title,
      updatedAt: formatUpdatedAt(session.updatedAt),
    }));
  }, [sessions]);

  const selectedConversation =
    visibleConversations.find(
      (conversation) => conversation.id === selectedConversationId,
    ) ?? null;

  const authMode = hydrated && isSignedIn ? "authenticated" : "guest";

  const handleCreateConversation = async () => {
    if (!isSignedIn || isCreatingSession) {
      return;
    }

    setIsCreatingSession(true);
    setSessionsError(null);

    try {
      const nextSession = await chatAiService.createSession();
      setSessions((currentSessions) => [nextSession, ...currentSessions]);
      setSelectedConversationId(nextSession.id);
      setSelectedSessionDetail({
        ...nextSession,
        userId,
        messages: [],
      });
      setSearchValue("");
      setDebouncedSearchValue("");
    } catch (error) {
      setSessionsError(
        error instanceof Error
          ? error.message
          : "Không tạo được hội thoại mới.",
      );
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleRenameConversation = async (
    conversationId: string,
    title: string,
  ) => {
    const targetConversation = sessions.find(
      (session) => session.id === conversationId,
    );

    if (!targetConversation || processingConversationId) {
      return;
    }

    setProcessingConversationId(conversationId);
    setSessionsError(null);

    try {
      const updatedSession = await chatAiService.updateSessionTitle(
        conversationId,
        {
          title,
        },
      );

      setSessions((currentSessions) =>
        currentSessions.map((session) =>
          session.id === conversationId ? updatedSession : session,
        ),
      );
      setSelectedSessionDetail((currentDetail) =>
        currentDetail?.id === conversationId
          ? {
              ...currentDetail,
              title: updatedSession.title,
              updatedAt: updatedSession.updatedAt,
            }
          : currentDetail,
      );
    } catch (error) {
      setSessionsError(
        error instanceof Error
          ? error.message
          : "Không đổi được tên hội thoại.",
      );
    } finally {
      setProcessingConversationId(null);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (processingConversationId) {
      return;
    }

    setProcessingConversationId(conversationId);
    setSessionsError(null);

    try {
      await chatAiService.deleteSession(conversationId);

      setSessions((currentSessions) => {
        const nextSessions = currentSessions.filter(
          (session) => session.id !== conversationId,
        );

        setSelectedConversationId((currentId) => {
          if (currentId !== conversationId) {
            return currentId;
          }

          return nextSessions[0]?.id ?? null;
        });
        setSelectedSessionDetail((currentDetail) =>
          currentDetail?.id === conversationId ? null : currentDetail,
        );

        return nextSessions;
      });
    } catch (error) {
      setSessionsError(
        error instanceof Error ? error.message : "Không xóa được hội thoại.",
      );
    } finally {
      setProcessingConversationId(null);
    }
  };

  const handleSendMessage = async () => {
    const sessionId = selectedConversationId;
    const content = composerValue.trim();
    const requestSessionId = isSignedIn ? sessionId : undefined;

    if (!sessionId || !content || isSendingMessage) {
      return;
    }

    const optimisticUserMessage: ChatAiMessage = {
      id: createTempId("user"),
      sessionId,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    const optimisticAssistantMessage: ChatAiMessage = {
      id: createTempId("assistant"),
      sessionId,
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };

    setComposerValue("");
    setIsSendingMessage(true);
    setSessionDetailError(null);
    setSelectedSessionDetail((currentDetail) => {
      if (!currentDetail || currentDetail.id !== sessionId) {
        return currentDetail;
      }

      return {
        ...currentDetail,
        title:
          !isSignedIn && currentDetail.messages.length === 0
            ? createGuestConversationTitle(content)
            : currentDetail.title,
        updatedAt: optimisticUserMessage.createdAt,
        messages: [
          ...currentDetail.messages,
          optimisticUserMessage,
          optimisticAssistantMessage,
        ],
      };
    });

    try {
      const response = await chatAiService.sendMessage({
        sessionId: requestSessionId ?? undefined,
        message: content,
      });
      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error("Không đọc được stream phản hồi.");
      }

      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        assistantContent += decoder.decode(value, { stream: true });
        setSelectedSessionDetail((currentDetail) => {
          if (!currentDetail || currentDetail.id !== sessionId) {
            return currentDetail;
          }

          return {
            ...currentDetail,
            messages: currentDetail.messages.map((message) =>
              message.id === optimisticAssistantMessage.id
                ? { ...message, content: assistantContent }
                : message,
            ),
          };
        });
      }

      assistantContent += decoder.decode();

      setSelectedSessionDetail((currentDetail) => {
        if (!currentDetail || currentDetail.id !== sessionId) {
          return currentDetail;
        }

        return {
          ...currentDetail,
          messages: currentDetail.messages.map((message) =>
            message.id === optimisticAssistantMessage.id
              ? { ...message, content: assistantContent }
              : message,
          ),
        };
      });

      if (requestSessionId) {
        await Promise.all([
          refreshSessionDetail(requestSessionId),
          refreshSessions({
            preserveSelectedId: requestSessionId,
            nextSearchValue: "",
          }),
        ]);
      }
    } catch (error) {
      setSessionDetailError(
        error instanceof Error ? error.message : "Không gửi được tin nhắn.",
      );
      setComposerValue(content);

      if (!requestSessionId) {
        setSelectedSessionDetail((currentDetail) => {
          if (!currentDetail || currentDetail.id !== sessionId) {
            return currentDetail;
          }

          return {
            ...currentDetail,
            messages: currentDetail.messages.filter(
              (message) =>
                message.id !== optimisticUserMessage.id &&
                message.id !== optimisticAssistantMessage.id,
            ),
          };
        });
        return;
      }

      await refreshSessionDetail(requestSessionId);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const refreshSessionDetail = async (sessionId: string) => {
    const requestId = ++sessionDetailRequestIdRef.current;

    try {
      const nextDetail = await chatAiService.getSessionDetail(sessionId);

      if (
        requestId !== sessionDetailRequestIdRef.current ||
        selectedConversationIdRef.current !== sessionId
      ) {
        return;
      }

      setSelectedSessionDetail((currentDetail) =>
        mergeSessionDetail(currentDetail, nextDetail),
      );
      setSessionDetailError(null);
    } catch (error) {
      if (
        requestId !== sessionDetailRequestIdRef.current ||
        selectedConversationIdRef.current !== sessionId
      ) {
        return;
      }

      setSessionDetailError(
        error instanceof Error
          ? error.message
          : "Không tải được nội dung hội thoại.",
      );
    }
  };

  const refreshSessions = async (options?: {
    preserveSelectedId?: string | null;
    nextSearchValue?: string;
  }) => {
    const nextSearch = options?.nextSearchValue ?? searchValue;

    try {
      const nextSessions = await chatAiService.getSessions({
        search: nextSearch,
      });

      setSessions(nextSessions);
      setSessionsError(null);
      setSelectedConversationId((currentId) => {
        const preservedId = options?.preserveSelectedId ?? currentId;

        if (
          preservedId &&
          nextSessions.some((session) => session.id === preservedId)
        ) {
          return preservedId;
        }

        return nextSessions[0]?.id ?? null;
      });
    } catch (error) {
      setSessionsError(
        error instanceof Error
          ? error.message
          : "Không tải được lịch sử hội thoại.",
      );
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] bg-background text-foreground">
      <AssistantSidebar
        authMode={authMode}
        conversations={visibleConversations}
        isCreatingConversation={isCreatingSession}
        isHydrated={hydrated}
        isLoadingConversations={isLoadingSessions}
        isOpen={isSidebarOpen}
        onCreateConversation={handleCreateConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        processingConversationId={processingConversationId}
        searchValue={searchValue}
        selectedConversationId={selectedConversationId}
        sessionsError={sessionsError}
        onSearchChange={setSearchValue}
        onSelectConversation={setSelectedConversationId}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
      />

      <AssistantContent
        authMode={authMode}
        composerValue={composerValue}
        isLoadingSessionDetail={isLoadingSessionDetail}
        isSidebarOpen={isSidebarOpen}
        isSendingMessage={isSendingMessage}
        messages={selectedSessionDetail?.messages ?? []}
        selectedConversationId={selectedConversationId}
        selectedConversationTitle={
          selectedConversation?.title ?? selectedSessionDetail?.title ?? null
        }
        sessionDetailError={sessionDetailError}
        onComposerChange={setComposerValue}
        onSendMessage={handleSendMessage}
        onToggleSidebar={() => setIsSidebarOpen((current) => !current)}
      />
    </main>
  );
}

function formatUpdatedAt(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function createTempId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createGuestConversationTitle(content: string): string {
  const normalizedContent = content.trim().replace(/\s+/g, " ");

  if (!normalizedContent) {
    return "Cuộc hội thoại tạm";
  }

  return normalizedContent.slice(0, 60);
}

function createGuestSessionDetail(): ChatAiSessionDetail {
  const createdAt = new Date().toISOString();

  return {
    id: GUEST_SESSION_ID,
    title: "Cuộc hội thoại tạm",
    createdAt,
    updatedAt: createdAt,
    userId: GUEST_USER_ID,
    messages: [],
  };
}

function mergeSessionDetail(
  currentDetail: ChatAiSessionDetail | null,
  nextDetail: ChatAiSessionDetail,
): ChatAiSessionDetail {
  if (!currentDetail || currentDetail.id !== nextDetail.id) {
    return nextDetail;
  }

  if (currentDetail.messages.length > nextDetail.messages.length) {
    return {
      ...nextDetail,
      messages: currentDetail.messages,
    };
  }

  const currentLastMessage = currentDetail.messages.at(-1);
  const nextLastMessage = nextDetail.messages.at(-1);

  if (
    currentLastMessage?.role === "assistant" &&
    nextLastMessage?.role === "assistant" &&
    currentLastMessage.content.length > nextLastMessage.content.length
  ) {
    return {
      ...nextDetail,
      messages: currentDetail.messages,
    };
  }

  return nextDetail;
}
