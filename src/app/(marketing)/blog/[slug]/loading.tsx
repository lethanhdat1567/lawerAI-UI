// src/app/(marketing)/blog/[slug]/loading.tsx
export default function BlogPostLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14 md:py-16">
      <div className="h-4 w-24 animate-pulse rounded-md bg-muted/40" />
      <div className="mt-10 lg:grid lg:grid-cols-[1fr_300px] lg:gap-10">
        <div className="space-y-4">
          <div className="h-4 w-2/3 max-w-lg animate-pulse rounded-md bg-muted/40" />
          <div className="h-10 w-full max-w-2xl animate-pulse rounded-lg bg-muted/40" />
          <div className="mt-8 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-3 w-full animate-pulse rounded bg-muted/25"
              />
            ))}
          </div>
        </div>
        <div className="mt-10 h-72 animate-pulse rounded-2xl border border-border/70 bg-muted/20 lg:mt-0" />
      </div>
    </div>
  );
}
