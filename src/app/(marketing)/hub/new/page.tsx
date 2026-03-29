// src/app/(marketing)/hub/new/page.tsx
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { HubNewPostAuthGuard } from "@/app/(marketing)/hub/_components/hubNewPostAuthGuard";

const HubNewPostFormLazy = dynamic(
  () =>
    import("@/app/(marketing)/hub/_components/hubNewPostForm").then((m) => ({
      default: m.HubNewPostForm,
    })),
  {
    loading: () => (
      <p className="text-sm text-muted-foreground">Đang tải trình soạn…</p>
    ),
  },
);

export default function HubNewPostPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14 md:py-16">
      <Link
        href="/hub"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Về Hub
      </Link>
      <header className="mt-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Đăng bài mới
        </h1>
        <p className="mt-3 text-muted-foreground">
          Soạn tiêu đề và nội dung; trình soạn hỗ trợ định dạng phong phú.
        </p>
      </header>
      <div className="mt-10">
        <HubNewPostAuthGuard>
          <HubNewPostFormLazy />
        </HubNewPostAuthGuard>
      </div>
    </div>
  );
}
