// src/lib/assistant/queries.ts — read helpers over in-memory structures (mock / client state)

import type {
  AssistantConversationListItem,
  AssistantConversationWithMessages,
  AssistantMessageDto,
} from "./types";

export function conversationToListItem(
  c: AssistantConversationWithMessages,
): AssistantConversationListItem {
  return {
    id: c.id,
    userId: c.userId,
    title: c.title,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export function listConversationsFrom(
  items: AssistantConversationWithMessages[],
): AssistantConversationListItem[] {
  return [...items]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map(conversationToListItem);
}

export function getConversationById(
  items: AssistantConversationWithMessages[],
  id: string,
): AssistantConversationWithMessages | undefined {
  return items.find((c) => c.id === id);
}

export function displayTitle(c: AssistantConversationListItem): string {
  if (c.title?.trim()) return c.title.trim();
  return "Cuộc trò chuyện mới";
}

export function makeNewConversation(userId: string): AssistantConversationWithMessages {
  const now = new Date().toISOString();
  const id = `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    userId,
    title: null,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

export function appendMessage(
  conv: AssistantConversationWithMessages,
  message: Omit<AssistantMessageDto, "id" | "conversationId" | "createdAt"> & {
    id?: string;
    createdAt?: string;
  },
): AssistantConversationWithMessages {
  const now = new Date().toISOString();
  const id = message.id ?? `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const full: AssistantMessageDto = {
    ...message,
    id,
    conversationId: conv.id,
    createdAt: message.createdAt ?? now,
  };
  let nextTitle = conv.title;
  if (!nextTitle && message.role === "USER" && message.content?.trim()) {
    const t = message.content.trim();
    nextTitle = t.length > 48 ? `${t.slice(0, 48)}…` : t;
  }
  return {
    ...conv,
    title: nextTitle,
    updatedAt: now,
    messages: [...conv.messages, full],
  };
}
