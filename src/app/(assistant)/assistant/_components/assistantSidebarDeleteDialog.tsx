"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { AssistantSidebarDeleteDialogProps } from "./assistantSidebar.types";

export function AssistantSidebarDeleteDialog({
  conversationTitle,
  isOpen,
  onConfirm,
  onOpenChange,
}: AssistantSidebarDeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-none border-black/5 dark:border-white/10 dark:bg-[oklch(0.16_0.01_285)]">
        <AlertDialogHeader>
          <AlertDialogTitle className="dark:text-slate-100">
            Xóa cuộc hội thoại?
          </AlertDialogTitle>
          <AlertDialogDescription className="dark:text-slate-400">
            {conversationTitle
              ? `Hội thoại "${conversationTitle}" sẽ bị xóa khỏi lịch sử của bạn.`
              : "Cuộc hội thoại này sẽ bị xóa khỏi lịch sử của bạn."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-none border-black/5 dark:border-white/10 dark:bg-white/4 dark:text-slate-300 dark:hover:bg-white/8 dark:hover:text-slate-100">
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            className="rounded-none bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            onClick={onConfirm}
          >
            Xóa hội thoại
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
