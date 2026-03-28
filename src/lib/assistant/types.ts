// src/lib/assistant/types.ts — mirror Prisma AssistantConversation / AssistantMessage / roles

export type AssistantMessageRole = "USER" | "ASSISTANT" | "SYSTEM";

export type MessageRatingValue = "UP" | "DOWN";

export interface AssistantMessageDto {
  id: string;
  conversationId: string;
  role: AssistantMessageRole;
  content: string;
  createdAt: string;
  metadataJson?: Record<string, unknown> | null;
}

export interface AssistantConversationListItem {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssistantConversationWithMessages extends AssistantConversationListItem {
  messages: AssistantMessageDto[];
}
