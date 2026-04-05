// src/components/layout/site-header.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOutIcon, MenuIcon, UserRoundIcon } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOutClient } from "@/lib/auth/signOutClient";
import { resolvePublicImageUrl } from "@/lib/media/resolvePublicImageUrl";
import { mainNavItems, siteName } from "@/lib/site-config";
import { ThemeToggle } from "@/components/themeToggle";
import { cn } from "@/lib/utils";
import type { PublicUser } from "@/services/auth/authTypes";
import { useAuthStore } from "@/stores/auth-store";
import { useUiStore } from "@/stores/ui-store";

const sheetListVariants = {
  open: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
  closed: {},
};

const sheetItemVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: 10 },
};

function userDisplayName(u: PublicUser): string {
  const d = u.profile.displayName?.trim();
  if (d) return d;
  return (u.username?.trim() || u.email.split("@")[0] || u.email).trim();
}

function userInitial(u: PublicUser): string {
  const base = userDisplayName(u);
  return base.slice(0, 1).toUpperCase() || "?";
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const { mobileNavOpen, setMobileNavOpen } = useUiStore();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isSignedIn = Boolean(user ?? accessToken);
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const headerAvatarSrc = user
    ? resolvePublicImageUrl(user.profile.avatarUrl)
    : null;

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 12);
  });

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,backdrop-filter,border-color] duration-300",
        scrolled
          ? "border-border/80 bg-background/80 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
      initial={false}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5 md:h-[3.75rem]">
        <Link
          href="/"
          className="font-heading text-lg font-extrabold tracking-tight text-foreground md:text-xl"
        >
          {siteName.toUpperCase()}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Chính">
          {mainNavItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 md:gap-3">
          <ThemeToggle />
          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                type="button"
                className="hidden rounded-full p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring md:inline-flex"
                aria-label="Tài khoản"
              >
                <span className="sr-only">
                  {user ? userDisplayName(user) : "Tài khoản"}
                </span>
                <Avatar className="size-9 border border-border bg-card shadow-sm">
                  {user ? (
                    <>
                      {headerAvatarSrc ? (
                        <AvatarImage src={headerAvatarSrc} alt="" />
                      ) : null}
                      <AvatarFallback className="bg-card text-sm font-semibold text-foreground">
                        {userInitial(user)}
                      </AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback className="bg-card">
                      <UserRoundIcon className="size-4" aria-hidden />
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-56">
                {user ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col gap-0.5">
                        <span className="truncate text-sm font-medium text-foreground">
                          {userDisplayName(user)}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel className="font-normal text-muted-foreground">
                      Phiên đăng nhập
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Hồ sơ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/my/hub")}>
                  Nội dung của tôi
                </DropdownMenuItem>
                {isAdmin ? (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    Admin
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => void signOutClient()}
                >
                  <LogOutIcon />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          {!isSignedIn ? (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:inline-block"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="hidden rounded-full px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:text-primary md:inline-block"
              >
                Đăng ký
              </Link>
            </>
          ) : null}
          <Link
            href="/assistant"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_-4px_oklch(0.72_0.22_285/0.65)] transition-[transform,box-shadow] hover:scale-[1.02] hover:shadow-[0_0_32px_-4px_oklch(0.72_0.22_285/0.8)] md:inline-flex"
          >
            Hỏi đáp AI
          </Link>

          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-card/80 text-foreground md:hidden"
            >
              <MenuIcon className="size-5" />
              <span className="sr-only">Mở menu</span>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(100%,20rem)] gap-0 border-l border-border bg-card p-0"
            >
              <SheetHeader className="border-b border-border px-5 py-4">
                <SheetTitle className="font-heading text-left text-lg font-bold">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <motion.nav
                className="flex flex-col px-2 py-3"
                initial="closed"
                animate={mobileNavOpen ? "open" : "closed"}
                variants={sheetListVariants}
              >
                {mainNavItems.map((item) => (
                  <motion.div key={item.href} variants={sheetItemVariants}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className="block rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="my-2 h-px bg-border" />
                <motion.div variants={sheetItemVariants} className="px-2">
                  <div className="flex justify-center py-2">
                    <ThemeToggle />
                  </div>
                </motion.div>
                {isSignedIn ? (
                  <>
                    {user ? (
                      <motion.div
                        variants={sheetItemVariants}
                        className="px-4 py-3"
                      >
                        <p className="text-xs font-medium text-muted-foreground">
                          Đã đăng nhập
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-foreground">
                          {userDisplayName(user)}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        variants={sheetItemVariants}
                        className="px-4 py-3 text-sm text-muted-foreground"
                      >
                        Đang tải hồ sơ…
                      </motion.div>
                    )}
                    <motion.div variants={sheetItemVariants}>
                      <Link
                        href="/profile"
                        onClick={() => setMobileNavOpen(false)}
                        className="block rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted"
                      >
                        Hồ sơ
                      </Link>
                    </motion.div>
                    <motion.div variants={sheetItemVariants}>
                      <Link
                        href="/my"
                        onClick={() => setMobileNavOpen(false)}
                        className="block rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted"
                      >
                        Nội dung của tôi
                      </Link>
                    </motion.div>
                    <motion.div variants={sheetItemVariants} className="px-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMobileNavOpen(false);
                          void signOutClient();
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 py-3 text-sm font-semibold text-destructive"
                      >
                        <LogOutIcon className="size-4" />
                        Đăng xuất
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div variants={sheetItemVariants}>
                      <Link
                        href="/login"
                        onClick={() => setMobileNavOpen(false)}
                        className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
                      >
                        Đăng nhập
                      </Link>
                    </motion.div>
                    <motion.div
                      variants={sheetItemVariants}
                      className="px-2 pt-2"
                    >
                      <Link
                        href="/register"
                        onClick={() => setMobileNavOpen(false)}
                        className="flex w-full items-center justify-center rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
                      >
                        Đăng ký
                      </Link>
                    </motion.div>
                  </>
                )}
              </motion.nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
