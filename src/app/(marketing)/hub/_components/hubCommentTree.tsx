// src/app/(marketing)/hub/_components/hubCommentTree.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  CornerDownRightIcon,
  HeartIcon,
  Loader2Icon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { HubAuthorAvatar } from "@/app/(marketing)/hub/_components/hubAuthorAvatar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/errors";
import {
  hubMeCommentLikesBatch,
  hubMeCreateComment,
  hubMeDeleteComment,
  hubMePatchComment,
  hubMeToggleCommentLike,
} from "@/lib/hub/hubApi";
import type { HubCommentNode } from "@/lib/hub/types";
import { userProfilePath } from "@/lib/user/profilePath";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

function collectHubCommentIds(nodes: HubCommentNode[]): string[] {
  const out: string[] = [];
  function walk(ns: HubCommentNode[]) {
    for (const n of ns) {
      out.push(n.id);
      if (n.replies.length) walk(n.replies);
    }
  }
  walk(nodes);
  return out;
}

function formatCommentTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type HubCommentEngagement = {
  likeCounts: Record<string, number>;
  likedMap: Record<string, boolean>;
  signedIn: boolean;
  currentUserId: string | null;
  toggleLike: (commentId: string) => Promise<void>;
};

function HubCommentItem({
  node,
  depth,
  postId,
  loginHref,
  canReply,
  authReady,
  currentUserId,
  onRequestDelete,
  commentEngagement,
}: {
  node: HubCommentNode;
  depth: number;
  postId: string;
  loginHref: string;
  canReply: boolean;
  authReady: boolean;
  currentUserId: string | null;
  onRequestDelete: (commentId: string) => void;
  commentEngagement: HubCommentEngagement;
}) {
  const router = useRouter();
  const maxDepth = 4;
  const isOwner = currentUserId !== null && node.author.id === currentUserId;
  const authorProfileHref = userProfilePath(node.author.username);
  const likeCount =
    commentEngagement.likeCounts[node.id] ?? node.likeCount;
  const likedByMe = commentEngagement.likedMap[node.id] ?? false;
  const canClickLike =
    commentEngagement.signedIn &&
    commentEngagement.currentUserId !== null &&
    commentEngagement.currentUserId !== node.author.id;

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(node.body);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);

  async function submitReply() {
    if (!replyBody.trim()) return;
    setReplySubmitting(true);
    try {
      await hubMeCreateComment(postId, {
        body: replyBody.trim(),
        parentId: node.id,
      });
      toast.success("Đã gửi phản hồi.");
      setReplyBody("");
      setReplyOpen(false);
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Không gửi được phản hồi.";
      toast.error(msg);
    } finally {
      setReplySubmitting(false);
    }
  }

  async function handleLikeClick() {
    setLikeBusy(true);
    try {
      await commentEngagement.toggleLike(node.id);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Không cập nhật được thích.";
      toast.error(msg);
    } finally {
      setLikeBusy(false);
    }
  }

  async function saveEdit() {
    if (!editBody.trim()) {
      toast.error("Nội dung không được để trống.");
      return;
    }
    setEditSubmitting(true);
    try {
      await hubMePatchComment(postId, node.id, { body: editBody.trim() });
      toast.success("Đã cập nhật bình luận.");
      setEditing(false);
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Không cập nhật được.";
      toast.error(msg);
    } finally {
      setEditSubmitting(false);
    }
  }

  return (
    <div
      className="rounded-xl border border-border bg-white/3 p-4"
      style={{ marginLeft: depth > 0 ? Math.min(depth * 12, 48) : 0 }}
    >
      <div className="flex gap-3">
        <HubAuthorAvatar
          author={node.author}
          className="size-9"
          size="lg"
          profileHref={authorProfileHref}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <Link
              href={authorProfileHref}
              className="inline-flex flex-wrap items-baseline gap-2 rounded-sm text-left outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="font-semibold text-foreground">
                {node.author.displayName ?? node.author.username}
              </span>
              <span className="text-xs text-muted-foreground">
                @{node.author.username}
              </span>
            </Link>
            <time
              className="text-xs text-muted-foreground"
              dateTime={node.createdAt}
            >
              {formatCommentTime(node.createdAt)}
            </time>
          </div>
          {editing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={3}
                className="w-full resize-y rounded-lg border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={editSubmitting}
                  onClick={() => void saveEdit()}
                >
                  {editSubmitting ? (
                    <Loader2Icon className="size-4 animate-spin" aria-hidden />
                  ) : null}
                  Lưu
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={editSubmitting}
                  onClick={() => {
                    setEditing(false);
                    setEditBody(node.body);
                  }}
                >
                  Hủy
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {node.body}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1">
              {canClickLike ? (
                <button
                  type="button"
                  disabled={likeBusy}
                  onClick={() => void handleLikeClick()}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold transition-colors",
                    likedByMe
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-pressed={likedByMe}
                >
                  {likeBusy ? (
                    <Loader2Icon className="size-3.5 animate-spin" aria-hidden />
                  ) : (
                    <HeartIcon
                      className={cn("size-3.5", likedByMe && "fill-current")}
                      aria-hidden
                    />
                  )}
                  <span>{likeCount}</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <HeartIcon className="size-3.5 opacity-60" aria-hidden />
                  {likeCount}
                </span>
              )}
            </span>
            {depth < maxDepth && canReply ? (
              <button
                type="button"
                onClick={() => setReplyOpen((v) => !v)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Trả lời
              </button>
            ) : null}
            {isOwner && !editing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(true);
                    setEditBody(node.body);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <PencilIcon className="size-3.5" aria-hidden />
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => onRequestDelete(node.id)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-destructive hover:underline"
                >
                  <Trash2Icon className="size-3.5" aria-hidden />
                  Xóa
                </button>
              </>
            ) : null}
          </div>
          {depth < maxDepth && authReady && !canReply ? (
            <p className="mt-2 text-xs text-muted-foreground">
              <Link href={loginHref} className="font-semibold text-primary hover:underline">
                Đăng nhập
              </Link>{" "}
              để trả lời.
            </p>
          ) : null}
          {replyOpen && canReply ? (
            <div className="mt-3 space-y-2 rounded-lg border border-primary/25 bg-primary/5 p-3">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <CornerDownRightIcon className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                <span>Trả lời @{node.author.username}</span>
              </div>
              <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                rows={3}
                placeholder="Nội dung phản hồi…"
                className="w-full resize-y rounded-lg border border-border bg-background/50 px-3 py-2 text-sm focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={replySubmitting}
                  onClick={() => void submitReply()}
                >
                  {replySubmitting ? (
                    <Loader2Icon className="size-4 animate-spin" aria-hidden />
                  ) : null}
                  Gửi
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={replySubmitting}
                  onClick={() => {
                    setReplyOpen(false);
                    setReplyBody("");
                  }}
                >
                  Hủy
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {node.replies.length > 0 ? (
        <ul className="mt-4 space-y-3 border-l border-border pl-4">
          {node.replies.map((r) => (
            <li key={r.id}>
              <HubCommentItem
                node={r}
                depth={depth + 1}
                postId={postId}
                loginHref={loginHref}
                canReply={canReply}
                authReady={authReady}
                currentUserId={currentUserId}
                onRequestDelete={onRequestDelete}
                commentEngagement={commentEngagement}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function HubCommentTree({
  postId,
  nodes,
}: {
  postId: string;
  nodes: HubCommentNode[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthStore((s) => s.hydrated);
  const signedIn = useAuthStore((s) => Boolean(s.user ?? s.accessToken));
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);
  const loginHref = `/login?next=${encodeURIComponent(pathname || "/hub")}`;
  const canReply = hydrated && signedIn;
  const authReady = hydrated;

  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const m: Record<string, number> = {};
    function walk(ns: HubCommentNode[]) {
      for (const n of ns) {
        m[n.id] = n.likeCount;
        if (n.replies.length) walk(n.replies);
      }
    }
    walk(nodes);
    setLikeCounts(m);
  }, [nodes]);

  useEffect(() => {
    if (!hydrated || !signedIn) return;
    const ids = collectHubCommentIds(nodes);
    if (ids.length === 0) return;
    let cancelled = false;
    void hubMeCommentLikesBatch(ids)
      .then((r) => {
        if (cancelled) return;
        const lm: Record<string, boolean> = {};
        for (const x of r.items) lm[x.commentId] = x.liked;
        setLikedMap((prev) => ({ ...prev, ...lm }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [nodes, hydrated, signedIn]);

  const toggleCommentLike = useCallback(
    async (commentId: string) => {
      const r = await hubMeToggleCommentLike(postId, commentId);
      setLikeCounts((prev) => ({ ...prev, [commentId]: r.likeCount }));
      setLikedMap((prev) => ({ ...prev, [commentId]: r.liked }));
    },
    [postId],
  );

  const commentEngagement: HubCommentEngagement = {
    likeCounts,
    likedMap,
    signedIn,
    currentUserId,
    toggleLike: toggleCommentLike,
  };

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await hubMeDeleteComment(postId, deleteId);
      toast.success("Đã xóa bình luận.");
      setDeleteId(null);
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : "Không xóa được bình luận.";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  }

  if (nodes.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-card/20 px-4 py-8 text-center text-sm text-muted-foreground">
        Chưa có bình luận.
        {!hydrated ? null : !signedIn ? (
          <>
            {" "}
            <Link href={loginHref} className="font-semibold text-primary hover:underline">
              Đăng nhập
            </Link>{" "}
            để bình luận đầu tiên.
          </>
        ) : (
          <> Hãy là người đầu tiên chia sẻ.</>
        )}
      </p>
    );
  }

  return (
    <>
      <ul className="space-y-4">
        {nodes.map((n) => (
          <li key={n.id}>
            <HubCommentItem
              node={n}
              depth={0}
              postId={postId}
              loginHref={loginHref}
              canReply={canReply}
              authReady={authReady}
              currentUserId={currentUserId}
              onRequestDelete={setDeleteId}
              commentEngagement={commentEngagement}
            />
          </li>
        ))}
      </ul>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa bình luận?</AlertDialogTitle>
            <AlertDialogDescription>
              Bình luận sẽ bị ẩn khỏi bài viết. Bạn có chắc không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={() => void confirmDelete()}
            >
              {deleting ? (
                <Loader2Icon className="size-4 animate-spin" aria-hidden />
              ) : null}
              Xóa
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
