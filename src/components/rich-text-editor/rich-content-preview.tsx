"use client";

import { useLayoutEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { isHtmlContentEffectivelyEmpty } from "@/lib/editor/plain-excerpt";
import { normalizeImageResizeHtmlForPreview } from "@/lib/editor/normalize-tiptap-image-preview-html";

import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/rich-text-editor/rich-content-preview.scss";

type RichContentPreviewProps = {
  html: string;
  className?: string;
};

/** Renders stored editor HTML with the same typography as Tiptap (read-only). */
export function RichContentPreview({
  html,
  className,
}: RichContentPreviewProps) {
  const empty = isHtmlContentEffectivelyEmpty(html);
  const [inner, setInner] = useState(() => (empty ? "" : html));

  useLayoutEffect(() => {
    if (empty) {
      setInner("");
      return;
    }
    setInner(normalizeImageResizeHtmlForPreview(html));
  }, [html, empty]);

  if (empty) {
    return (
      <div
        className={cn(
          "rich-content-preview--empty flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/25 px-4 py-8 text-center text-sm text-muted-foreground",
          className,
        )}
      >
        Chưa có nội dung để xem trước
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rich-content-preview rounded-xl border border-border bg-background/50",
        className,
      )}
    >
      <div className="simple-editor-content max-w-none">
        <div
          className="tiptap ProseMirror simple-editor"
          // Hub/Blog body is authored in-app; sanitized server-side when wired to API.
          dangerouslySetInnerHTML={{ __html: inner }}
        />
      </div>
    </div>
  );
}
