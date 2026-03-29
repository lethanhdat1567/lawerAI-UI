import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { BlogPostAuthGuard } from "@/app/(marketing)/blog/_components/blogAuthGuard";

const BlogNewPostFormLazy = dynamic(
  () =>
    import("@/app/(marketing)/blog/_components/blogNewPostForm").then((m) => ({
      default: m.BlogNewPostForm,
    })),
  {
    loading: () => (
      <p className="text-sm text-muted-foreground">Đang tải trình soạn…</p>
    ),
  },
);

export default function BlogNewPostPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:py-14 md:py-16">
      <Link
        href="/my/blog"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Blog của tôi
      </Link>
      <header className="mt-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Bài blog mới
        </h1>
        <p className="mt-3 text-muted-foreground">
          Soạn tiêu đề, tóm tắt và nội dung; có thể lưu nháp hoặc xuất bản.
        </p>
      </header>
      <div className="mt-10">
        <BlogPostAuthGuard loginNext="/blog/new">
          <BlogNewPostFormLazy />
        </BlogPostAuthGuard>
      </div>
    </div>
  );
}
