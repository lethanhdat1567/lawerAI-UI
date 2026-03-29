"use client";

import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AssistantRatingRow() {
  return (
    <div className="mt-1 flex gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        disabled
        title="Khi có API — đánh giá tin nhắn trợ lý"
        className="text-muted-foreground"
        aria-label="Hữu ích (chưa kết nối API)"
      >
        <ThumbsUpIcon className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        disabled
        title="Khi có API — đánh giá tin nhắn trợ lý"
        className="text-muted-foreground"
        aria-label="Không hữu ích (chưa kết nối API)"
      >
        <ThumbsDownIcon className="size-3.5" />
      </Button>
    </div>
  );
}
