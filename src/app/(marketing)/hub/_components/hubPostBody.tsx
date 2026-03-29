// src/app/(marketing)/hub/_components/hubPostBody.tsx
"use client";

import { RichContentPreview } from "@/components/rich-text-editor/richContentPreview";

/** Nội dung từ Tiptap (HTML lưu API) — render giống block xem trước ở hubNewPostForm. */
export function HubPostBody({ body }: { body: string }) {
  return (
    <RichContentPreview
      html={body}
      className="border-0 bg-transparent p-0 shadow-none"
    />
  );
}
