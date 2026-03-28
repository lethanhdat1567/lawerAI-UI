// src/app/(marketing)/hub/[slug]/loading.tsx
export default function HubPostLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14 md:py-16">
      <div className="h-4 w-28 animate-pulse rounded-md bg-muted/40" />
      <div className="mt-10 space-y-4 lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">
        <div className="space-y-4">
          <div className="h-4 w-3/4 max-w-md animate-pulse rounded-md bg-muted/40" />
          <div className="h-10 w-full max-w-2xl animate-pulse rounded-lg bg-muted/40" />
          <div className="h-4 w-48 animate-pulse rounded-md bg-muted/30" />
          <div className="mt-8 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-3 w-full animate-pulse rounded bg-muted/25"
              />
            ))}
          </div>
        </div>
        <div className="h-64 animate-pulse rounded-2xl border border-border/70 bg-muted/20" />
      </div>
    </div>
  );
}
