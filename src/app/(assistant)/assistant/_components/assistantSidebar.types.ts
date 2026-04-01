"use client";

export interface AssistantSidebarProps {
  authMode: "guest" | "authenticated";
  conversations: AssistantSidebarConversation[];
  isCreatingConversation: boolean;
  isHydrated: boolean;
  isLoadingConversations: boolean;
  isOpen: boolean;
  processingConversationId: string | null;
  searchValue: string;
  selectedConversationId: string | null;
  sessionsError: string | null;
  onCreateConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  onRenameConversation: (conversationId: string, title: string) => Promise<void>;
  onSearchChange: (value: string) => void;
  onSelectConversation: (conversationId: string) => void;
  onToggleSidebar: () => void;
}

export interface AssistantSidebarConversation {
  id: string;
  title: string;
  updatedAt: string;
}

export interface AssistantSidebarConversationSectionProps {
  conversations: AssistantSidebarConversation[];
  deleteConversationId: string | null;
  editingConversationId: string | null;
  isGuest: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  processingConversationId: string | null;
  selectedConversationId: string | null;
  onCancelRename: () => void;
  onConfirmDelete: (conversationId: string) => void;
  onRenameConversation: (conversationId: string, title: string) => Promise<void>;
  onSelectConversation: (conversationId: string) => void;
  onStartRename: (conversationId: string) => void;
}

export interface AssistantSidebarConversationItemProps {
  conversation: AssistantSidebarConversation;
  isActive: boolean;
  isDeleteOpen: boolean;
  isEditing: boolean;
  isProcessing: boolean;
  onCancelRename: () => void;
  onConfirmDelete: (conversationId: string) => void;
  onRenameConversation: (conversationId: string, title: string) => Promise<void>;
  onSelectConversation: (conversationId: string) => void;
  onStartRename: (conversationId: string) => void;
}

export interface AssistantSidebarDeleteDialogProps {
  conversationTitle?: string;
  isOpen: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

export interface AssistantSidebarFooterProps {
  isHistoryActive?: boolean;
}

export interface AssistantSidebarStateProps {
  description: string;
}
