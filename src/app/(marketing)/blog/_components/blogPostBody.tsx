"use client";

import { RichContentPreview } from "@/components/rich-text-editor/richContentPreview";

/** Nội dung HTML từ RichTextEditor — giống Hub. */
export function BlogPostBody({ body }: { body: string }) {
  return (
    <RichContentPreview
      html={body}
      className="border-0 bg-transparent p-0 shadow-none"
    />
  );
}
