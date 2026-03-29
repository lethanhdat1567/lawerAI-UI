// src/components/auth/auth-top-bar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { siteName } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function AuthTopBar() {
  const pathname = usePathname();
  const showRegister =
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  return (
    <header className="flex w-full shrink-0 items-center justify-between border-b border-border px-5 py-4">
      <Link
        href="/"
        className="font-heading text-lg font-extrabold tracking-tight text-foreground"
      >
        {siteName.toUpperCase()}
      </Link>
      {showRegister ? (
        <Link
          href="/register"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-9 rounded-lg border-border bg-transparent px-4 text-foreground hover:bg-muted",
          )}
        >
          Đăng ký
        </Link>
      ) : (
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-9 rounded-lg border-border bg-transparent px-4 text-foreground hover:bg-muted",
          )}
        >
          Đăng nhập
        </Link>
      )}
    </header>
  );
}
