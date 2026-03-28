// src/app/(marketing)/hub/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { HubCommentComposer } from "@/app/(marketing)/hub/_components/hub-comment-composer";
import { HubCommentTree } from "@/app/(marketing)/hub/_components/hub-comment-tree";
import { HubOversightPanel } from "@/app/(marketing)/hub/_components/hub-oversight-panel";
import { HubPostBody } from "@/app/(marketing)/hub/_components/hub-post-body";
import { HubPostDetailHeader } from "@/app/(marketing)/hub/_components/hub-post-detail-header";
import { buildCommentTree, getPostBySlug } from "@/lib/hub/queries";

interface HubPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: HubPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Không tìm thấy bài" };
  }
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function HubPostPage({ params }: HubPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const commentTree = buildCommentTree(post.comments);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14 md:py-16">
      <Link
        href="/hub"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Về Hub
      </Link>

      <article className="mt-8 lg:grid lg:grid-cols-[1fr_320px] lg:items-start lg:gap-10 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <HubPostDetailHeader post={post} />
          <div className="py-10">
            <HubPostBody body={post.body} />
          </div>

          <section aria-labelledby="hub-comments-heading" className="border-t border-border pt-10">
            <h2
              id="hub-comments-heading"
              className="font-heading text-xl font-bold tracking-tight"
            >
              Bình luận ({post.comments.length})
            </h2>
            <div className="mt-6">
              <HubCommentTree nodes={commentTree} />
            </div>
            <div className="mt-8">
              <HubCommentComposer />
            </div>
          </section>
        </div>

        <div className="mt-12 lg:mt-0">
          <HubOversightPanel versions={post.oversightVersions} />
        </div>
      </article>
    </div>
  );
}
