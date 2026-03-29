// src/app/(marketing)/blog/_components/blogSearchBar.tsx
"use client";

import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";
import { SearchIcon } from "lucide-react";

export function BlogSearchBar() {
  const [q, setQ] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: true, throttleMs: 300 })
  );

  return (
    <div className="relative">
      <label className="sr-only" htmlFor="blog-q">
        Tìm trong Blog
      </label>
      <SearchIcon
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        id="blog-q"
        type="search"
        value={q}
        onChange={(e) => void setQ(e.target.value || null)}
        placeholder="Tìm theo tiêu đề, nội dung…"
        className="h-11 w-full rounded-xl border border-border bg-card/60 py-2 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground backdrop-blur-md focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
