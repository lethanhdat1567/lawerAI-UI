import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { HubAiFeedbackPanel } from "@/app/(marketing)/hub/_components/hubAiFeedbackPanel";
import { HubCommentComposer } from "@/app/(marketing)/hub/_components/hubCommentComposer";
import { HubCommentTree } from "@/app/(marketing)/hub/_components/hubCommentTree";
import { HubPostBody } from "@/app/(marketing)/hub/_components/hubPostBody";
import { HubPostDetailHeader } from "@/app/(marketing)/hub/_components/hubPostDetailHeader";
import { buildCommentTree } from "@/lib/hub/buildCommentTree";
import { fetchHubPostDetailPublic } from "@/lib/hub/fetchHubPublic";

export const dynamic = "force-dynamic";

interface HubPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: HubPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchHubPostDetailPublic(slug);
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
  const post = await fetchHubPostDetailPublic(slug);
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

          <section
            aria-labelledby="hub-comments-heading"
            className="border-t border-border pt-10"
          >
            <h2
              id="hub-comments-heading"
              className="font-heading text-xl font-bold tracking-tight"
            >
              Bình luận ({post.commentCount})
            </h2>
            <div className="mt-6">
              <HubCommentTree postId={post.id} nodes={commentTree} />
            </div>
            <div className="mt-8">
              <HubCommentComposer postId={post.id} />
            </div>
          </section>
        </div>
        <HubAiFeedbackPanel feedback={post.aiFeedback} />
      </article>
    </div>
  );
}
