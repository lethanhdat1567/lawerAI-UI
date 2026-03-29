"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookmarkIcon, HeartIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import {
  blogMeEngagement,
  blogMeToggleLike,
  blogMeToggleSave,
} from "@/lib/blog/blogApi";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

export function BlogPostEngagement({
  postId,
  initialLikeCount,
  initialSavedCount,
}: {
  postId: string;
  initialLikeCount: number;
  initialSavedCount: number;
}) {
  const pathname = usePathname();
  const hydrated = useAuthStore((s) => s.hydrated);
  const signedIn = useAuthStore((s) => Boolean(s.user ?? s.accessToken));

  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [savedCount, setSavedCount] = useState(initialSavedCount);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [likeBusy, setLikeBusy] = useState(false);
  const [saveBusy, setSaveBusy] = useState(false);

  const loginHref = `/login?next=${encodeURIComponent(pathname || "/blog")}`;

  useEffect(() => {
    setLikeCount(initialLikeCount);
    setSavedCount(initialSavedCount);
  }, [initialLikeCount, initialSavedCount]);

  useEffect(() => {
    if (!hydrated) return;
    if (!signedIn) {
      setLiked(false);
      setSaved(false);
      setLoadingState(false);
      return;
    }
    let cancelled = false;
    setLoadingState(true);
    void (async () => {
      try {
        const e = await blogMeEngagement(postId);
        if (cancelled) return;
        setLiked(e.liked);
        setSaved(e.saved);
      } catch {
        if (!cancelled) {
          setLiked(false);
          setSaved(false);
        }
      } finally {
        if (!cancelled) setLoadingState(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated, signedIn, postId]);

  async function onToggleLike() {
    if (!signedIn) return;
    setLikeBusy(true);
    try {
      const r = await blogMeToggleLike(postId);
      setLiked(r.liked);
      setLikeCount(r.likeCount);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Không cập nhật được thích.");
    } finally {
      setLikeBusy(false);
    }
  }

  async function onToggleSave() {
    if (!signedIn) return;
    setSaveBusy(true);
    try {
      const r = await blogMeToggleSave(postId);
      setSaved(r.saved);
      setSavedCount(r.savedCount);
      toast.success(r.saved ? "Đã lưu bài." : "Đã bỏ lưu.");
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : "Không cập nhật được lưu.");
    } finally {
      setSaveBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 border-b border-border pb-8">
      <div
        className="flex w-full max-w-md flex-wrap items-center justify-center gap-y-2 sm:max-w-lg"
        role="group"
        aria-label="Thích và lưu bài"
      >
        <div className="flex flex-1 basis-[140px] items-center justify-center sm:basis-auto sm:flex-initial">
          {signedIn ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "gap-2",
                liked &&
                  "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300",
              )}
              disabled={likeBusy || loadingState}
              onClick={() => void onToggleLike()}
            >
              {likeBusy ? (
                <Loader2Icon className="size-4 animate-spin" aria-hidden />
              ) : (
                <HeartIcon
                  className={cn("size-4", liked && "fill-current")}
                  aria-hidden
                />
              )}
              Thích
              <span className="tabular-nums text-muted-foreground">
                ({likeCount})
              </span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              render={<Link href={loginHref} />}
            >
              <HeartIcon className="size-4" aria-hidden />
              Thích ({likeCount})
            </Button>
          )}
        </div>

        <div
          className="hidden h-7 w-px shrink-0 bg-border sm:mx-1 sm:block"
          aria-hidden
        />

        <div className="flex flex-1 basis-[140px] items-center justify-center sm:basis-auto sm:flex-initial">
          {signedIn ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={cn(
                "gap-2",
                saved && "border-primary/40 bg-primary/10",
              )}
              disabled={saveBusy || loadingState}
              onClick={() => void onToggleSave()}
            >
              {saveBusy ? (
                <Loader2Icon className="size-4 animate-spin" aria-hidden />
              ) : (
                <BookmarkIcon
                  className={cn("size-4", saved && "fill-current")}
                  aria-hidden
                />
              )}
              Lưu
              <span className="tabular-nums text-muted-foreground">
                ({savedCount})
              </span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              render={<Link href={loginHref} />}
            >
              <BookmarkIcon className="size-4" aria-hidden />
              Lưu ({savedCount})
            </Button>
          )}
        </div>
      </div>

      {signedIn && hydrated ? (
        <p className="text-center text-xs text-muted-foreground">
          <Link
            href="/my/blog/saved"
            className="font-medium text-primary hover:underline"
          >
            Bài đã lưu
          </Link>{" "}
          của bạn.
        </p>
      ) : null}
      {!signedIn && hydrated ? (
        <p className="text-center text-xs text-muted-foreground">
          <Link
            href={loginHref}
            className="font-medium text-primary hover:underline"
          >
            Đăng nhập
          </Link>{" "}
          để thích hoặc lưu bài.
        </p>
      ) : null}
    </div>
  );
}
