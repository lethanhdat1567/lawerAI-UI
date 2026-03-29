// src/app/(marketing)/hub/_components/hubOversightPanel.tsx
import { BotIcon, ScaleIcon } from "lucide-react";

import { getCurrentOversight, parseSuggestionItems } from "@/lib/hub/queries";
import type { HubOversightVersionUI } from "@/lib/hub/types";

export function HubOversightPanel({
  versions,
}: {
  versions: HubOversightVersionUI[];
}) {
  const current = getCurrentOversight(versions);
  const suggestions = current ? parseSuggestionItems(current.suggestionsJson) : [];

  return (
    <aside className="rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-md lg:sticky lg:top-24">
      <div className="flex items-center gap-2 text-primary">
        <span className="flex size-9 items-center justify-center rounded-xl border border-primary/25 bg-primary/10">
          <BotIcon className="size-4" aria-hidden />
        </span>
        <div>
          <h2 className="font-heading text-sm font-bold tracking-tight">
            AI thư ký — oversight
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Tóm tắt &amp; gợi ý (demo)
          </p>
        </div>
      </div>

      {!current ? (
        <p className="mt-5 text-sm text-muted-foreground">
          Chưa có bản tóm tắt cho bài này.
        </p>
      ) : (
        <>
          <p className="mt-5 text-sm leading-relaxed text-foreground/90">
            {current.summaryText}
          </p>

          {suggestions.length > 0 ? (
            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Gợi ý
              </p>
              <ul className="mt-2 space-y-2">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-muted-foreground"
                  >
                    <ScaleIcon className="mt-0.5 size-3.5 shrink-0 text-primary/70" aria-hidden />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            {current.legalCorpusVersion ? (
              <span className="rounded-lg border border-border bg-muted/50 px-2 py-1 font-mono text-[10px] text-muted-foreground">
                Corpus: {current.legalCorpusVersion}
              </span>
            ) : null}
            {current.modelVersion ? (
              <span className="rounded-lg border border-border bg-muted/50 px-2 py-1 font-mono text-[10px] text-muted-foreground">
                Model: {current.modelVersion}
              </span>
            ) : null}
            <span className="rounded-lg border border-border bg-muted/50 px-2 py-1 text-[10px] text-muted-foreground">
              Phiên bản {current.version}
              {current.isCurrent ? " · hiện tại" : ""}
            </span>
          </div>
        </>
      )}
    </aside>
  );
}
