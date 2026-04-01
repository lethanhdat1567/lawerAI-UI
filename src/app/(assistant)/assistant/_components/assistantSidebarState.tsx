"use client";

import type { AssistantSidebarStateProps } from "./assistantSidebar.types";

export function AssistantSidebarState({
  description,
}: AssistantSidebarStateProps) {
  return (
    <div className="border border-dashed border-black/5 bg-white px-4 py-6 text-center dark:border-white/10 dark:bg-white/3">
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
