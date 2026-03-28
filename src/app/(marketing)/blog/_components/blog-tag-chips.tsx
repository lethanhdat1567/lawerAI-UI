// src/app/(marketing)/blog/_components/blog-tag-chips.tsx
"use client";

import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";

import { mockBlogTags } from "@/lib/blog/mock-data";
import { cn } from "@/lib/utils";

export function BlogTagChips() {
  const [tag, setTag] = useQueryState(
    "tag",
    parseAsString.withOptions({ shallow: true, history: "replace" })
  );

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc thẻ">
      <button
        type="button"
        onClick={() => void setTag(null)}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
          !tag
            ? "border-primary/50 bg-primary/15 text-primary"
            : "border-border bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground"
        )}
      >
        Tất cả
      </button>
      {mockBlogTags.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => void setTag(t.slug === tag ? null : t.slug)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
            tag === t.slug
              ? "border-primary/50 bg-primary/15 text-primary"
              : "border-border bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground"
          )}
        >
          {t.name}
        </button>
      ))}
    </div>
  );
}
