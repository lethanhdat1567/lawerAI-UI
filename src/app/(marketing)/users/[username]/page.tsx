import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  BookOpenIcon,
  FileTextIcon,
  MessagesSquareIcon,
  UserRoundIcon,
} from "lucide-react";

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
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
}

function profileTitle(p: PublicProfile): string {
  const name = p.displayName?.trim() || p.username;
  return `${name} · Hồ sơ`;
}

function formatCount(
  count: number,
  singular: string,
  plural = singular,
): string {
  return `${count} ${count === 1 ? singular : plural}`;
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

  const [
    { items: blogItems, total: blogTotal },
    { items: hubItems, total: hubTotal },
  ] = await Promise.all([
    fetchPublicBlogPostsByAuthorId(profile.userId),
    fetchPublicHubPostsByAuthorId(profile.userId),
  ]);

  const display = profile.displayName?.trim() || profile.username;
  const avatarSrc = resolvePublicImageUrl(profile.avatarUrl);
  const bio = profile.bio?.trim() ?? "";
  const hasBio = bio.length > 0;
  const totalPublished = blogTotal + hubTotal;
  const isActiveContributor = totalPublished > 0;
  const introCopy = isActiveContributor
    ? `${display} đã chia sẻ ${formatCount(totalPublished, "nội dung")} công khai trên LawerAI, gồm ${formatCount(blogTotal, "bài blog")} và ${formatCount(hubTotal, "chủ đề hub")}.`
    : `${display} đã tạo hồ sơ công khai trên LawerAI và hiện chưa có nội dung nào được xuất bản.`;
  const spotlightBlog = blogItems[0] ?? null;
  const spotlightHub = hubItems[0] ?? null;
  const stats = [
    {
      label: "Bài blog",
      value: blogTotal,
      description:
        blogTotal > 0 ? "Đã xuất bản công khai" : "Chưa có bài công khai",
      icon: BookOpenIcon,
    },
    {
      label: "Chủ đề hub",
      value: hubTotal,
      description:
        hubTotal > 0 ? "Đang tham gia thảo luận" : "Chưa có chủ đề công khai",
      icon: MessagesSquareIcon,
    },
    {
      label: "Tổng nội dung",
      value: totalPublished,
      description:
        totalPublished > 0
          ? "Dấu ấn đang hiển thị trên hồ sơ"
          : "Hồ sơ đang ở giai đoạn giới thiệu",
      icon: FileTextIcon,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-12 md:py-14">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeftIcon className="size-4" aria-hidden />
        Về trang chủ
      </Link>

      <section className="rounded-3xl border border-border bg-card/45 p-6 backdrop-blur-md sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-start">
          <div className="min-w-0">
            <header className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
              <Avatar
                size="lg"
                className="size-20 shrink-0 text-lg sm:size-24 sm:text-xl"
              >
                {avatarSrc ? <AvatarImage src={avatarSrc} alt="" /> : null}
                <AvatarFallback className="bg-primary/15 font-heading font-bold text-primary">
                  {display.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary">
                    Hồ sơ công khai
                  </span>
                  {profile.role === "VERIFIED_LAWYER" ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                      <BadgeCheckIcon className="size-3.5" aria-hidden />
                      Luật sư đã xác minh
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                    <UserRoundIcon className="size-3.5" aria-hidden />
                    {isActiveContributor ? "Đang hoạt động" : "Mới tham gia"}
                  </span>
                </div>
                <div className="space-y-1">
                  <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {display}
                  </h1>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    @{profile.username}
                  </p>
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-foreground/85 sm:text-base">
                  {introCopy}
                </p>
              </div>
            </header>
          </div>

          <aside className="rounded-2xl border border-border/80 bg-background/70 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Tổng quan nhanh
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-border bg-card/60 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {stat.label}
                        </p>
                        <p className="mt-2 font-heading text-3xl font-bold tracking-tight text-foreground">
                          {stat.value}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary/10 p-2 text-primary">
                        <Icon className="size-4" aria-hidden />
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <article className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Giới thiệu
          </h2>
          {hasBio ? (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground/90 sm:text-[15px]">
              {bio}
            </p>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-background/60 px-4 py-5 text-sm leading-relaxed text-muted-foreground">
              Chưa có thông tin giới thiệu.
            </div>
          )}
        </article>

        <article className="rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-md">
          <h2 className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Điểm nhấn nội dung
          </h2>
          <div className="mt-4 space-y-3">
            {[
              {
                label: "Bài blog mới nhất",
                title: spotlightBlog?.title ?? "Chưa có bài blog công khai",
                href: spotlightBlog ? `/blog/${spotlightBlog.slug}` : null,
                description:
                  spotlightBlog?.excerpt ??
                  "Khi user xuất bản bài viết, nội dung mới nhất sẽ xuất hiện ở đây.",
              },
              {
                label: "Chủ đề hub gần đây",
                title: spotlightHub?.title ?? "Chưa có chủ đề hub công khai",
                href: spotlightHub ? `/hub/${spotlightHub.slug}` : null,
                description:
                  spotlightHub?.excerpt ??
                  "Khi user bắt đầu thảo luận trên Hub, chủ đề gần đây nhất sẽ xuất hiện ở đây.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  "rounded-2xl border p-4 transition-colors",
                  item.href
                    ? "border-border bg-background/70 hover:border-primary/30"
                    : "border-dashed border-border bg-background/50",
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </p>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="mt-2 block font-heading text-base font-bold tracking-tight text-foreground transition-colors hover:text-primary"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <p className="mt-2 font-heading text-base font-bold tracking-tight text-foreground/80">
                    {item.title}
                  </p>
                )}
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-12 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-foreground">
              <BookOpenIcon
                className="size-5 text-primary opacity-90"
                aria-hidden
              />
              Blog đã xuất bản
            </h2>
            <p className="text-sm text-muted-foreground">
              Các bài viết công khai đang đại diện cho góc nhìn và đóng góp của{" "}
              {display}.
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-medium text-primary hover:underline"
          >
            Xem Blog
          </Link>
        </div>
        {blogItems.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card/30 px-4 py-8 text-center text-sm text-muted-foreground">
            Chưa có bài blog công khai. Khi có bài mới, danh sách sẽ xuất hiện
            tại đây.
          </p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                Đang hiển thị {blogItems.length} bài gần nhất trong tổng{" "}
                {blogTotal} bài blog đã xuất bản.
              </p>
            ) : null}
          </>
        )}
      </section>

      <section className="mt-14 space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <h2 className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight text-foreground">
              <MessagesSquareIcon
                className="size-5 text-primary opacity-90"
                aria-hidden
              />
              Thảo luận cộng đồng
            </h2>
            <p className="text-sm text-muted-foreground">
              Những chủ đề gần đây cho thấy {display} đang quan tâm và trao đổi
              điều gì trong cộng đồng.
            </p>
          </div>
          <Link
            href="/hub"
            className="text-sm font-medium text-primary hover:underline"
          >
            Xem cộng đồng
          </Link>
        </div>
        {hubItems.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card/30 px-4 py-8 text-center text-sm text-muted-foreground">
            Chưa có chủ đề cộng đồng công khai. Khi user tham gia thảo luận, nội
            dung sẽ xuất hiện tại đây.
          </p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {hubItems.map((post) => (
                <HubPostCard key={post.id} post={post} variant="onProfile" />
              ))}
            </div>
            {hubTotal > hubItems.length ? (
              <p className="text-center text-xs text-muted-foreground">
                Đang hiển thị {hubItems.length} chủ đề gần nhất trong tổng{" "}
                {hubTotal} chủ đề công khai.
              </p>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
