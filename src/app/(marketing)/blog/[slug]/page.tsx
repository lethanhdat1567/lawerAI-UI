// src/app/(marketing)/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/article/article-body";
import { BlogPostDetailHeader } from "@/app/(marketing)/blog/_components/blog-post-detail-header";
import { BlogPostSidebar } from "@/app/(marketing)/blog/_components/blog-post-sidebar";
import { getBlogPostBySlug } from "@/lib/blog/queries";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
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
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

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
          <div className="py-10">
            <ArticleBody body={post.body} />
          </div>
        </div>
        <div className="mt-12 lg:mt-0">
          <BlogPostSidebar post={post} />
        </div>
      </article>
    </div>
  );
}
