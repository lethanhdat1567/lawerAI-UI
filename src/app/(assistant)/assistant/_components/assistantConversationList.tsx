import { MessageSquareText, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AssistantConversationListProps {
  conversations: {
    id: string;
    title: string;
    updatedAt: string;
  }[];
  isLoading: boolean;
  processingConversationId: string | null;
  selectedConversationId: string | null;
  onDeleteConversation: (conversationId: string) => void;
  onRenameConversation: (conversationId: string) => void;
  onSelectConversation: (conversationId: string) => void;
}

export function AssistantConversationList({
  conversations,
  isLoading,
  processingConversationId,
  selectedConversationId,
  onDeleteConversation,
  onRenameConversation,
  onSelectConversation,
}: AssistantConversationListProps) {
  if (isLoading) {
    return (
      <div className="flex h-full min-h-40 items-center justify-center border border-dashed border-border/70 bg-background px-4 text-center">
        <p className="text-sm text-muted-foreground">
          Đang tải lịch sử hội thoại...
        </p>
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div className="flex h-full min-h-40 items-center justify-center border border-dashed border-border/70 bg-background px-4 text-center">
        <p className="text-sm text-muted-foreground">
          Chưa có cuộc hội thoại nào phù hợp để hiển thị.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2">
        {conversations.map((conversation) => {
          const isActive = conversation.id === selectedConversationId;
          const isProcessing = conversation.id === processingConversationId;

          return (
            <div
              key={conversation.id}
              className={cn(
                "border rounded-none",
                isActive
                  ? "border-foreground/20 bg-foreground/5"
                  : "border-border/60 bg-background",
              )}
            >
              <Button
                className="flex h-auto w-full items-start justify-start gap-3 rounded-none px-3 py-3 text-left hover:bg-muted/40"
                variant="ghost"
                onClick={() => onSelectConversation(conversation.id)}
              >
                <MessageSquareText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                <div className="min-w-0 flex-1 space-y-1">
                  <p className="truncate text-sm font-medium">{conversation.title}</p>
                  <p className="text-xs text-muted-foreground">{conversation.updatedAt}</p>
                </div>
              </Button>

              <div className="flex items-center justify-end gap-1 border-t border-border/60 px-2 py-2">
                <Button
                  aria-label="Đổi tên hội thoại"
                  className="rounded-none"
                  disabled={isProcessing}
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onRenameConversation(conversation.id)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  aria-label="Xóa hội thoại"
                  className="rounded-none text-destructive hover:text-destructive"
                  disabled={isProcessing}
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onDeleteConversation(conversation.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
