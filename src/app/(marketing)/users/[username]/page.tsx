import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, BookOpenIcon, MessagesSquareIcon } from "lucide-react";

import { BlogPostCard } from "@/app/(marketing)/blog/_components/blogPostCard";
import { HubPostCard } from "@/app/(marketing)/hub/_components/hubPostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  fetchPublicProfileByUsername,
  type PublicProfile,
} from "@/lib/user/fetchPublicProfile";
import {
  fetchPublicBlogPostsByAuthorId,
  fetchPublicHubPostsByAuthorId,
} from "@/lib/user/fetchAuthorPublicPosts";
import { resolvePublicImageUrl } from "@/lib/media/resolvePublicImageUrl";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
}

function profileTitle(p: PublicProfile): string {
  const name = p.displayName?.trim() || p.username;
  return `${name} · Hồ sơ`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await fetchPublicProfileByUsername(username);
  if (!profile) {
    return { title: "Không tìm thấy người dùng" };
  }
  return {
    title: profileTitle(profile),
    description: profile.bio?.trim() || `@${profile.username} trên LawerAI`,
  };
}

export default async function PublicUserProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = await fetchPublicProfileByUsername(username);
  if (!profile) notFound();

  const [{ items: blogItems, total: blogTotal }, { items: hubItems, total: hubTotal }] =
    await Promise.all([
      fetchPublicBlogPostsByAuthorId(profile.userId),
      fetchPublicHubPostsByAuthorId(profile.userId),
    ]);

  const display = profile.displayName?.trim() || profile.username;
  const avatarSrc = resolvePublicImageUrl(profile.avatarUrl);

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:py-12 md:py-14">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Về trang chủ
      </Link>

      <header className="flex flex-col items-center gap-4 border-b border-border pb-10 text-center sm:flex-row sm:items-start sm:text-left">
        <Avatar
          size="lg"
          className="size-20 shrink-0 text-lg sm:size-24 sm:text-xl"
        >
          {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
          <AvatarFallback className="bg-primary/15 font-heading font-bold text-primary">
            {display.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {display}
          </h1>
          <p className="text-sm text-muted-foreground">@{profile.username}</p>
        </div>
      </header>

      {profile.bio?.trim() ? (
        <div className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Giới thiệu
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {profile.bio.trim()}
          </p>
        </div>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          Người dùng chưa thêm giới thiệu.
        </p>
      )}

      <section className="mt-12 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-foreground">
            <BookOpenIcon className="size-5 text-primary opacity-90" aria-hidden />
            Blog đã xuất bản
          </h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-primary hover:underline"
          >
            Xem Blog
          </Link>
        </div>
        {blogItems.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card/30 px-4 py-8 text-center text-sm text-muted-foreground">
            Chưa có bài blog công khai.
          </p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {blogItems.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  variant="onProfile"
                  userEngagement={null}
                />
              ))}
            </div>
            {blogTotal > blogItems.length ? (
              <p className="text-center text-xs text-muted-foreground">
                Đang hiển thị {blogItems.length} bài gần nhất · Tổng{" "}
                {blogTotal} bài đã xuất bản.
              </p>
            ) : null}
          </>
        )}
      </section>

      <section className="mt-14 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight text-foreground">
            <MessagesSquareIcon
              className="size-5 text-primary opacity-90"
              aria-hidden
            />
            Thảo luận Hub
          </h2>
          <Link
            href="/hub"
            className="text-sm font-medium text-primary hover:underline"
          >
            Xem Hub
          </Link>
        </div>
        {hubItems.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card/30 px-4 py-8 text-center text-sm text-muted-foreground">
            Chưa có chủ đề Hub công khai.
          </p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hubItems.map((post) => (
                <HubPostCard key={post.id} post={post} variant="onProfile" />
              ))}
            </div>
            {hubTotal > hubItems.length ? (
              <p className="text-center text-xs text-muted-foreground">
                Đang hiển thị {hubItems.length} bài gần nhất · Tổng{" "}
                {hubTotal} bài đã xuất bản.
              </p>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
