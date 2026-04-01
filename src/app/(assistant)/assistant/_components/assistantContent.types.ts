export interface AssistantMessageItem {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface AssistantContentProps {
  authMode: "guest" | "authenticated";
  composerValue: string;
  isLoadingSessionDetail: boolean;
  isSidebarOpen: boolean;
  isSendingMessage: boolean;
  messages: AssistantMessageItem[];
  selectedConversationId: string | null;
  selectedConversationTitle: string | null;
  sessionDetailError: string | null;
  onComposerChange: (value: string) => void;
  onSendMessage: () => void;
  onToggleSidebar: () => void;
}
