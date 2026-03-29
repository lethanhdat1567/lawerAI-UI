// src/app/(marketing)/hub/page.tsx
import { Suspense } from "react";

import { HubFiltersToolbar } from "@/app/(marketing)/hub/_components/hubFiltersToolbar";
import { HubNewPostCta } from "@/app/(marketing)/hub/_components/hubNewPostCta";
import { HubPageLayout } from "@/app/(marketing)/hub/_components/hubPageLayout";
import { HubPostGrid } from "@/app/(marketing)/hub/_components/hubPostGrid";

function HubSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-11 max-w-xl animate-pulse rounded-xl bg-muted/40" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
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

export default function HubPage() {
  return (
    <HubPageLayout
      title="Không gian thảo luận"
      description="Đăng tình huống thực tế, nhận phản hồi cộng đồng và xem tóm tắt AI thư ký. Nội dung đồng bộ từ LawyerAI-api."
      action={<HubNewPostCta />}
    >
      <Suspense fallback={<HubSkeleton />}>
        <HubFiltersToolbar />
        <div className="mt-8">
          <HubPostGrid />
        </div>
      </Suspense>
    </HubPageLayout>
  );
}
