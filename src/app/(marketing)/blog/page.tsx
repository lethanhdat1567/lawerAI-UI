// src/app/(marketing)/blog/page.tsx
import { Suspense } from "react";

import { BlogFiltersToolbar } from "@/app/(marketing)/blog/_components/blog-filters-toolbar";
import { BlogPageLayout } from "@/app/(marketing)/blog/_components/blog-page-layout";
import { BlogPostGrid } from "@/app/(marketing)/blog/_components/blog-post-grid";

function BlogSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-11 max-w-xl animate-pulse rounded-xl bg-muted/40" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-20 animate-pulse rounded-full bg-muted/40"
          />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-2xl border border-border/70 bg-muted/20"
          />
        ))}
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <BlogPageLayout
      title="Blog & kiến thức"
      description="Bài viết chuyên sâu; bài có nhãn Verified khi đối chiếu được CSDL pháp (minh họa UI — dữ liệu demo)."
    >
      <Suspense fallback={<BlogSkeleton />}>
        <BlogFiltersToolbar />
        <div className="mt-8">
          <BlogPostGrid />
        </div>
      </Suspense>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Dữ liệu demo — slug và thẻ bám schema BlogPost / Tag.
      </p>
    </BlogPageLayout>
  );
}
