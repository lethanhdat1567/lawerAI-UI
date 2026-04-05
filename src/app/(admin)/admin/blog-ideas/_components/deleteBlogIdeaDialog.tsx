"use client";

import { useState } from "react";
import { toast } from "sonner";

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
import { ApiError } from "@/lib/api/errors";
import { blogIdeaDelete } from "@/services/blog-automation/blogIdeaApi";
import type { BlogIdea } from "@/services/blog-automation/types";

type DeleteBlogIdeaDialogProps = {
  idea: BlogIdea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => Promise<void>;
};

export function DeleteBlogIdeaDialog({
  idea,
  open,
  onOpenChange,
  onDeleted,
}: DeleteBlogIdeaDialogProps) {
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!idea) {
      return;
    }
    setDeleting(true);
    try {
      await blogIdeaDelete(idea.id);
      toast.success("Đã xóa ý tưởng.");
      onOpenChange(false);
      await onDeleted();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Xóa ý tưởng thất bại.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa ý tưởng blog?</AlertDialogTitle>
          <AlertDialogDescription>
            {idea
              ? `Ý tưởng "${idea.name}" sẽ bị xóa vĩnh viễn. Thao tác này không hoàn tác.`
              : "Ý tưởng này sẽ bị xóa vĩnh viễn."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
          <AlertDialogAction disabled={deleting} onClick={() => void confirmDelete()}>
            {deleting ? "Đang xóa…" : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
