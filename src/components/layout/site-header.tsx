// src/components/layout/site-header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNavItems, siteName } from "@/lib/site-config";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

const sheetListVariants = {
  open: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
  closed: {},
};

const sheetItemVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: 10 },
};

export function SiteHeader() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const { mobileNavOpen, setMobileNavOpen } = useUiStore();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 12);
  });

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,backdrop-filter,border-color] duration-300",
        scrolled
          ? "border-border/80 bg-background/80 backdrop-blur-md"
          : "border-transparent bg-transparent"
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
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 md:gap-3">
          <ThemeToggle />
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
          <Link
            href="/assistant"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_-4px_oklch(0.72_0.22_285/0.65)] transition-[transform,box-shadow] hover:scale-[1.02] hover:shadow-[0_0_32px_-4px_oklch(0.72_0.22_285/0.8)] md:inline-flex"
          >
            Bắt đầu
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
                <motion.div variants={sheetItemVariants}>
                  <Link
                    href="/login"
                    onClick={() => setMobileNavOpen(false)}
                    className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Đăng nhập
                  </Link>
                </motion.div>
                <motion.div variants={sheetItemVariants} className="px-2 pt-2">
                  <Link
                    href="/register"
                    onClick={() => setMobileNavOpen(false)}
                    className="flex w-full items-center justify-center rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
                  >
                    Đăng ký
                  </Link>
                </motion.div>
              </motion.nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
