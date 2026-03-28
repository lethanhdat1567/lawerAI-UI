// src/app/(marketing)/blog/_components/blog-filters-toolbar.tsx
"use client";

import { useQueryState } from "nuqs";

import { BlogSearchBar } from "@/app/(marketing)/blog/_components/blog-search-bar";
import { BlogTagChips } from "@/app/(marketing)/blog/_components/blog-tag-chips";
import {
  blogSortParser,
  blogVerifiedParser,
} from "@/lib/blog/nuqs-parsers";
import type { BlogSortMode } from "@/lib/blog/types";
import { cn } from "@/lib/utils";

export function BlogFiltersToolbar() {
  const [sort, setSort] = useQueryState(
    "sort",
    blogSortParser.withOptions({ shallow: true })
  );
  const [verifiedOnly, setVerifiedOnly] = useQueryState(
    "verified",
    blogVerifiedParser.withOptions({ shallow: true, history: "replace" })
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 lg:max-w-xl">
          <BlogSearchBar />
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
          <label
            htmlFor="blog-sort"
            className="text-xs font-medium text-muted-foreground sm:sr-only"
          >
            Sắp xếp
          </label>
          <select
            id="blog-sort"
            value={sort ?? "new"}
            onChange={(e) => void setSort(e.target.value as BlogSortMode)}
            className="h-11 rounded-xl border border-border bg-card/60 px-3 text-sm font-medium text-foreground backdrop-blur-md focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="new">Mới nhất</option>
            <option value="updated">Cập nhật gần đây</option>
          </select>
          <button
            type="button"
            onClick={() => void setVerifiedOnly(verifiedOnly ? null : true)}
            className={cn(
              "h-11 whitespace-nowrap rounded-xl border px-4 text-sm font-semibold transition-colors",
              verifiedOnly
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border bg-card/60 text-muted-foreground hover:border-border hover:text-foreground"
            )}
          >
            Chỉ Verified
          </button>
        </div>
      </div>
      <BlogTagChips />
    </div>
  );
}
