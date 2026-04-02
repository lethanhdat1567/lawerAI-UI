export type ChatAiRole = "user" | "assistant" | "system";

export interface ChatAiMessage {
  id: string;
  sessionId: string;
  role: ChatAiRole;
  content: string;
  metadata?: unknown;
  createdAt: string;
}

export interface ChatAiSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatAiSessionDetail extends ChatAiSession {
  userId: string;
  messages: ChatAiMessage[];
}

export interface ChatAiSessionQuery {
  search?: string;
}

export interface CreateChatSessionBody {
  title?: string;
}

export interface UpdateChatSessionTitleBody {
  title: string;
}

export interface SendChatMessageBody {
  sessionId?: string;
  message: string;
}

export interface DeleteChatSessionResult {
  message: string;
}
