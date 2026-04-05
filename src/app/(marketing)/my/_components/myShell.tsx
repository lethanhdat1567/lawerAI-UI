"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookmarkIcon, BookOpenIcon, MessagesSquareIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const NAV = [
  {
    href: "/my/hub",
    label: "Thảo luận cộng đồng",
    icon: MessagesSquareIcon,
    match: (pathname: string) =>
      pathname === "/my/hub" || pathname.startsWith("/my/hub/"),
  },
  {
    href: "/my/blog",
    label: "Blog của tôi",
    icon: BookOpenIcon,
    match: (pathname: string) =>
      pathname === "/my/blog" ||
      (pathname.startsWith("/my/blog/") &&
        !pathname.startsWith("/my/blog/saved")),
  },
  {
    href: "/my/blog/saved",
    label: "Đã lưu",
    icon: BookmarkIcon,
    match: (pathname: string) =>
      pathname === "/my/blog/saved" || pathname.startsWith("/my/blog/saved/"),
  },
] as const;

export function MyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-12 md:py-14">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <aside className="shrink-0 lg:w-56">
          <p className="font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Quản lý nội dung
          </p>
          <nav className="mt-4 flex flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1">
            {NAV.map(({ href, label, icon: Icon, match }) => {
              const active = match(pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                    active
                      ? "bg-primary/15 text-foreground ring-1 ring-primary/25"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
