// src/app/(marketing)/blog/_components/blogTagChips.tsx
"use client";

import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";

import { blogPublicTags } from "@/lib/blog/blogApi";
import type { BlogTag } from "@/lib/blog/types";
import { cn } from "@/lib/utils";

export function BlogTagChips() {
  const [tag, setTag] = useQueryState(
    "tag",
    parseAsString.withOptions({ shallow: true, history: "replace" }),
  );
  const [tags, setTags] = useState<BlogTag[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { tags: t } = await blogPublicTags();
        if (!cancelled) setTags(t);
      } catch {
        if (!cancelled) setTags([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (tags === null) {
    return (
      <div
        className="flex min-h-10 flex-wrap gap-2"
        role="group"
        aria-label="Lọc thẻ"
      >
        <div className="h-8 w-24 animate-pulse rounded-full bg-muted/40" />
        <div className="h-8 w-20 animate-pulse rounded-full bg-muted/40" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc thẻ">
      <button
        type="button"
        onClick={() => void setTag(null)}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
          !tag
            ? "border-primary/50 bg-primary/15 text-primary"
            : "border-border bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground",
        )}
      >
        Tất cả
      </button>
      {tags.map((t: BlogTag) => (
        <button
          key={t.id}
          type="button"
          onClick={() => void setTag(t.slug === tag ? null : t.slug)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
            tag === t.slug
              ? "border-primary/50 bg-primary/15 text-primary"
              : "border-border bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground",
          )}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}
