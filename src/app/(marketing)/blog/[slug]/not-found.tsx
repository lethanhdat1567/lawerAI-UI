// src/app/(marketing)/blog/[slug]/not-found.tsx
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default function BlogPostNotFound() {
  return (
    <div className="mx-auto max-w-lg px-5 py-20 text-center">
      <h1 className="font-heading text-2xl font-bold">Không tìm thấy bài</h1>
      <p className="mt-3 text-muted-foreground">
        Slug không tồn tại hoặc bài chưa xuất bản.
      </p>
      <Link
        href="/blog"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Về Blog
      </Link>
    </div>
  );
}
