"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { AssistantSidebarConversationItemProps } from "./assistantSidebar.types";

export function AssistantSidebarConversationItem({
  conversation,
  isActive,
  isDeleteOpen,
  isEditing,
  isProcessing,
  onCancelRename,
  onConfirmDelete,
  onRenameConversation,
  onSelectConversation,
  onStartRename,
}: AssistantSidebarConversationItemProps) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RenameConversationFormValues>({
    resolver: zodResolver(renameConversationSchema),
    defaultValues: renameConversationDefaultValues,
  });

  useEffect(() => {
    if (isEditing) {
      reset({ title: conversation.title });
    }
  }, [conversation.title, isEditing, reset]);

  const isBusy = isProcessing || isSubmitting;

  const submitRename = handleSubmit(async (values) => {
    await onRenameConversation(conversation.id, values.title.trim());
    onCancelRename();
  });

  return (
    <div
      className={cn(
        "group border border-transparent bg-transparent transition-colors",
        isActive
          ? "border-black/5 bg-white dark:border-white/10 dark:bg-white/4"
          : "hover:bg-white/80 dark:hover:bg-white/3",
      )}
    >
      <div className="flex items-start gap-2 px-3 py-2.5">
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <form className="space-y-2" onSubmit={submitRename}>
              <Input
                autoFocus
                aria-invalid={Boolean(errors.title)}
                className="h-9 rounded-none border-black/5 bg-white text-sm text-slate-900 dark:border-white/10 dark:bg-white/4 dark:text-slate-100"
                disabled={isBusy}
                {...register("title")}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    onCancelRename();
                    reset({ title: conversation.title });
                  }
                }}
              />
              <div className="flex items-center gap-2">
                <Button
                  className="h-8 rounded-none border border-black/5 bg-slate-900 px-2 text-xs text-white shadow-none hover:bg-slate-800 dark:border-white/10 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                  disabled={isBusy}
                  type="submit"
                >
                  Lưu
                </Button>
                <Button
                  className="h-8 rounded-none border border-black/5 bg-white px-2 text-xs text-slate-600 shadow-none hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-white/4 dark:text-slate-300 dark:hover:bg-white/8 dark:hover:text-slate-100"
                  disabled={isBusy}
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onCancelRename();
                    reset({ title: conversation.title });
                  }}
                >
                  Hủy
                </Button>
              </div>
              {errors.title ? (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.title.message}
                </p>
              ) : null}
            </form>
          ) : (
            <button
              className="w-full min-w-0 text-left"
              type="button"
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="space-y-1">
                <p
                  className={cn(
                    "truncate text-sm text-slate-600 transition-colors group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-100",
                    isActive
                      ? "font-semibold text-slate-900 dark:text-slate-100"
                      : "font-medium",
                  )}
                >
                  {conversation.title}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {conversation.updatedAt}
                </p>
              </div>
            </button>
          )}
        </div>

        {!isEditing ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  aria-label={`Tùy chọn cho ${conversation.title}`}
                  className={cn(
                    "rounded-none border border-transparent bg-transparent text-slate-400 shadow-none transition-opacity hover:border-black/5 hover:bg-white hover:text-slate-900 dark:text-slate-500 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-slate-100",
                    isDeleteOpen || isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100",
                  )}
                  disabled={isBusy}
                  size="icon-sm"
                  variant="ghost"
                />
              }
            >
              <EllipsisVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-36 rounded-none border border-black/5 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-[oklch(0.16_0.01_285)]"
            >
              <DropdownMenuItem
                className="rounded-none text-slate-700 focus:bg-slate-100 focus:text-slate-900 dark:text-slate-300 dark:focus:bg-white/6 dark:focus:text-slate-100"
                onClick={() => onStartRename(conversation.id)}
              >
                Đổi tên
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-none text-red-500 focus:bg-red-50 focus:text-red-600 dark:text-red-400 dark:focus:bg-red-500/10 dark:focus:text-red-300"
                onClick={() => {
                  onCancelRename();
                  onConfirmDelete(conversation.id);
                }}
              >
                <Trash2 className="size-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </div>
  );
}

const renameConversationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Tên hội thoại không được để trống.")
    .max(120, "Tên hội thoại quá dài."),
});

const renameConversationDefaultValues = {
  title: "",
} satisfies RenameConversationFormValues;

type RenameConversationFormValues = z.infer<typeof renameConversationSchema>;
