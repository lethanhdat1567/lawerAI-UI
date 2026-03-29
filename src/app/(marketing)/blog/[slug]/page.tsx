// src/app/(marketing)/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { BlogCommentComposer } from "@/app/(marketing)/blog/_components/blogCommentComposer";
import { BlogCommentTree } from "@/app/(marketing)/blog/_components/blogCommentTree";
import { BlogPostBody } from "@/app/(marketing)/blog/_components/blogPostBody";
import { BlogPostDetailHeader } from "@/app/(marketing)/blog/_components/blogPostDetailHeader";
import { BlogPostEngagement } from "@/app/(marketing)/blog/_components/blogPostEngagement";
import { BlogPostSidebar } from "@/app/(marketing)/blog/_components/blogPostSidebar";
import { buildBlogCommentTree } from "@/lib/blog/buildCommentTree";
import { fetchBlogPostBySlugPublic } from "@/lib/blog/fetchBlogPublic";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostBySlugPublic(slug);
  if (!post) {
    return { title: "Không tìm thấy bài" };
  }
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await fetchBlogPostBySlugPublic(slug);
  if (!post) notFound();

  const commentTree = buildBlogCommentTree(post.comments);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14 md:py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Về Blog
      </Link>

      <article className="mt-8 lg:grid lg:grid-cols-[1fr_300px] lg:items-start lg:gap-10 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <BlogPostDetailHeader post={post} />
          <BlogPostEngagement
            postId={post.id}
            initialLikeCount={post.likeCount}
            initialSavedCount={post.savedCount}
          />
          <div className="py-10">
            <BlogPostBody body={post.body} />
          </div>

          <section
            aria-labelledby="blog-comments-heading"
            className="border-t border-border pt-10"
          >
            <h2
              id="blog-comments-heading"
              className="font-heading text-xl font-bold tracking-tight"
            >
              Bình luận ({post.commentCount})
            </h2>
            <div className="mt-6">
              <BlogCommentTree postId={post.id} nodes={commentTree} />
            </div>
            <div className="mt-8">
              <BlogCommentComposer postId={post.id} />
            </div>
          </section>
        </div>
        <div className="mt-12 lg:mt-0">
          <BlogPostSidebar post={post} />
        </div>
      </article>
    </div>
  );
}
