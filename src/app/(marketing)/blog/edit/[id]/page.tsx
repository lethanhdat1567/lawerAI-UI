import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { BlogPostAuthGuard } from "@/app/(marketing)/blog/_components/blogAuthGuard";

const BlogEditPostFormLazy = dynamic(
  () =>
    import("@/app/(marketing)/blog/_components/blogEditPostForm").then((m) => ({
      default: m.BlogEditPostForm,
    })),
  {
    loading: () => (
      <p className="text-sm text-muted-foreground">Đang tải trình soạn…</p>
    ),
  },
);

interface BlogEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogEditPostPage({ params }: BlogEditPageProps) {
  const { id } = await params;
  const loginNext = `/blog/edit/${id}`;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:py-14 md:py-16">
      <Link
        href="/my/blog"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Blog của tôi
      </Link>
      <header className="mt-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Sửa bài blog
        </h1>
        <p className="mt-3 text-muted-foreground">
          Cập nhật nội dung, trạng thái và thẻ.
        </p>
      </header>
      <div className="mt-10">
        <BlogPostAuthGuard loginNext={loginNext}>
          <BlogEditPostFormLazy />
        </BlogPostAuthGuard>
      </div>
    </div>
  );
}
