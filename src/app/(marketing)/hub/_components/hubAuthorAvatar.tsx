"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { HubAuthor } from "@/lib/hub/types";
import { resolvePublicImageUrl } from "@/lib/media/resolvePublicImageUrl";
import { cn } from "@/lib/utils";

export function HubAuthorAvatar({
  author,
  className,
  size = "default",
  profileHref,
}: {
  author: HubAuthor;
  className?: string;
  size?: "default" | "sm" | "lg";
  /** Khi có, avatar dẫn tới trang hồ sơ công khai */
  profileHref?: string;
}) {
  const src = resolvePublicImageUrl(author.avatarUrl);
  const display = author.displayName ?? author.username;
  const initial = display.slice(0, 1).toUpperCase();

  const avatar = (
    <Avatar size={size} className={cn("shrink-0", className)}>
      {src ? <AvatarImage src={src} alt="" /> : null}
      <AvatarFallback className="bg-primary/15 text-sm font-bold text-primary">
        {initial}
      </AvatarFallback>
    </Avatar>
  );

  if (profileHref) {
    return (
      <Link
        href={profileHref}
        className="inline-flex shrink-0 rounded-full outline-none ring-offset-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`Hồ sơ ${display}`}
      >
        {avatar}
      </Link>
    );
  }

  return avatar;
}
