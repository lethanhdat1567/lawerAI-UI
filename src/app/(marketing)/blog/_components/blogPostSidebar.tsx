// src/app/(marketing)/blog/_components/blogPostSidebar.tsx
import Link from "next/link";
import { ScaleIcon } from "lucide-react";

import type { BlogPostDetail } from "@/lib/blog/types";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BlogPostSidebar({ post }: { post: BlogPostDetail }) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-md">
        <h2 className="flex items-center gap-2 font-heading text-sm font-bold tracking-tight">
          <ScaleIcon className="size-4 text-primary" aria-hidden />
          Kiểm chứng &amp; nguồn
        </h2>

        {post.isVerified && post.verifiedAt ? (
          <div className="mt-4 space-y-3 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Đã kiểm chứng:</span>{" "}
              <time dateTime={post.verifiedAt}>
                {formatDateTime(post.verifiedAt)}
              </time>
            </p>
            {post.legalCorpusVersion ? (
              <p className="rounded-lg border border-border bg-muted/50 px-2 py-1.5 font-mono text-xs text-muted-foreground">
                Corpus: {post.legalCorpusVersion}
              </p>
            ) : null}
            {post.verificationNotes ? (
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Ghi chú kiểm chứng
                </p>
                <p className="mt-1 leading-relaxed text-foreground/90">
                  {post.verificationNotes}
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Bài này chưa có nhãn Verified — nội dung mang tính tham khảo; hãy tự
            đối chiếu văn bản pháp luật.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-md">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Thẻ
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <li key={t.id}>
              <Link
                href={`/blog?tag=${encodeURIComponent(t.slug)}`}
                className="inline-block rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground/90 hover:border-primary/35 hover:text-primary"
              >
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-dashed border-primary/25 bg-primary/5 p-5">
        <p className="text-sm font-medium text-foreground">
          Muốn thảo luận tình huống cụ thể?
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Đăng trên Hub để cộng đồng và AI thư ký hỗ trợ thêm ngữ cảnh.
        </p>
        <Link
          href="/hub"
          className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          Mở Hub
        </Link>
      </div>
    </aside>
  );
}
