// src/app/(marketing)/hub/_components/hub-comment-tree.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CornerDownRightIcon } from "lucide-react";

import type { HubCommentNode } from "@/lib/hub/types";
import { useAuthStore } from "@/stores/auth-store";

function formatCommentTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HubCommentItem({
  node,
  depth,
  loginHref,
  canReply,
  authReady,
}: {
  node: HubCommentNode;
  depth: number;
  loginHref: string;
  canReply: boolean;
  authReady: boolean;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const maxDepth = 4;

  return (
    <div
      className="rounded-xl border border-border bg-white/[0.03] p-4"
      style={{ marginLeft: depth > 0 ? Math.min(depth * 12, 48) : 0 }}
    >
      <div className="flex gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-primary/10 text-xs font-bold text-primary">
          {(node.author.displayName ?? node.author.username)
            .slice(0, 1)
            .toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-semibold text-foreground">
              {node.author.displayName ?? node.author.username}
            </span>
            <span className="text-xs text-muted-foreground">
              @{node.author.username}
            </span>
            <time
              className="text-xs text-muted-foreground"
              dateTime={node.createdAt}
            >
              {formatCommentTime(node.createdAt)}
            </time>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
            {node.body}
          </p>
          {depth < maxDepth && canReply ? (
            <button
              type="button"
              onClick={() => setReplyOpen((v) => !v)}
              className="mt-2 text-xs font-semibold text-primary hover:underline"
            >
              Trả lời
            </button>
          ) : null}
          {depth < maxDepth && authReady && !canReply ? (
            <p className="mt-2 text-xs text-muted-foreground">
              <Link href={loginHref} className="font-semibold text-primary hover:underline">
                Đăng nhập
              </Link>{" "}
              để trả lời.
            </p>
          ) : null}
          {replyOpen && canReply ? (
            <p className="mt-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
              <CornerDownRightIcon className="mr-1 inline size-3.5 text-primary" aria-hidden />
              Trả lời chỉ hiển thị trên UI demo.
            </p>
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
                loginHref={loginHref}
                canReply={canReply}
                authReady={authReady}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function HubCommentTree({ nodes }: { nodes: HubCommentNode[] }) {
  const pathname = usePathname();
  const hydrated = useAuthStore((s) => s.hydrated);
  const signedIn = useAuthStore((s) => Boolean(s.user ?? s.accessToken));
  const loginHref = `/login?next=${encodeURIComponent(pathname || "/hub")}`;
  const canReply = hydrated && signedIn;
  const authReady = hydrated;

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
          <> Hãy là người đầu tiên chia sẻ (demo).</>
        )}
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {nodes.map((n) => (
        <li key={n.id}>
          <HubCommentItem
            node={n}
            depth={0}
            loginHref={loginHref}
            canReply={canReply}
            authReady={authReady}
          />
        </li>
      ))}
    </ul>
  );
}
