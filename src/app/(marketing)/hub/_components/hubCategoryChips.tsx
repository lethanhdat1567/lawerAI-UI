// src/app/(marketing)/hub/_components/hubCategoryChips.tsx
"use client";

import { useEffect, useState } from "react";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";

import { ApiError } from "@/lib/api/errors";
import { hubPublicCategories } from "@/lib/hub/hubCategoryApi";
import type { HubCategoryUI } from "@/lib/hub/types";
import { cn } from "@/lib/utils";

export function HubCategoryChips() {
  const [category, setCategory] = useQueryState(
    "category",
    parseAsString.withOptions({ shallow: true, history: "replace" }),
  );
  const [cats, setCats] = useState<HubCategoryUI[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const { categories } = await hubPublicCategories();
        if (!cancelled) setCats(categories);
      } catch (e) {
        if (!cancelled && !(e instanceof ApiError)) {
          /* ignore */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc danh mục">
      <button
        type="button"
        onClick={() => void setCategory(null)}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
          !category
            ? "border-primary/50 bg-primary/15 text-primary"
            : "border-border bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground",
        )}
      >
        Tất cả
      </button>
      {cats.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() =>
            void setCategory(cat.slug === category ? null : cat.slug)
          }
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
            category === cat.slug
              ? "border-primary/50 bg-primary/15 text-primary"
              : "border-border bg-muted/50 text-muted-foreground hover:border-border hover:text-foreground",
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
