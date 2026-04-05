// src/app/(marketing)/hub/_components/hubFiltersToolbar.tsx
"use client";

import { useQueryState } from "nuqs";

import { HubCategoryChips } from "@/app/(marketing)/hub/_components/hubCategoryChips";
import { HubSearchBar } from "@/app/(marketing)/hub/_components/hubSearchBar";
import { hubSortParser } from "@/lib/hub/nuqs-parsers";
import type { HubSortMode } from "@/lib/hub/types";

export function HubFiltersToolbar() {
  const [sort, setSort] = useQueryState(
    "sort",
    hubSortParser.withOptions({ shallow: true }),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 lg:max-w-xl">
          <HubSearchBar />
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <label
            htmlFor="hub-sort"
            className="text-xs font-medium text-muted-foreground sm:sr-only"
          >
            Sắp xếp
          </label>
          <select
            id="hub-sort"
            value={sort ?? "new"}
            onChange={(e) => void setSort(e.target.value as HubSortMode)}
            className="h-11 rounded-xl border border-border bg-card/60 px-3 text-sm font-medium text-foreground backdrop-blur-md focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="new">Mới nhất</option>
            <option value="updated">Cập nhật gần đây</option>
          </select>
        </div>
      </div>
      <HubCategoryChips />
    </div>
  );
}
