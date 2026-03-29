import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { HubNewPostAuthGuard } from "@/app/(marketing)/hub/_components/hubNewPostAuthGuard";

const HubEditPostFormLazy = dynamic(
  () =>
    import("@/app/(marketing)/hub/_components/hubEditPostForm").then((m) => ({
      default: m.HubEditPostForm,
    })),
  {
    loading: () => (
      <p className="text-sm text-muted-foreground">Đang tải trình soạn…</p>
    ),
  },
);

export default function HubEditPostPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14 md:py-16">
      <Link
        href="/my/hub"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Quản lý bài Hub
      </Link>
      <header className="mt-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Sửa bài Hub
        </h1>
        <p className="mt-3 text-muted-foreground">
          Cập nhật tiêu đề, danh mục, trạng thái và nội dung; xem trước trước khi lưu.
        </p>
      </header>
      <div className="mt-10">
        <HubNewPostAuthGuard>
          <HubEditPostFormLazy />
        </HubNewPostAuthGuard>
      </div>
    </div>
  );
}
