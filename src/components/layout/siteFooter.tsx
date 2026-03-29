// src/components/layout/site-footer.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2Icon, GlobeIcon, MailIcon } from "lucide-react";

import { footerLegal, footerProduct, siteName } from "@/lib/site-config";

const socialLinks = [
  { href: "https://github.com", icon: Code2Icon, label: "Mã nguồn" },
  { href: "https://lawyerai.vn", icon: GlobeIcon, label: "Trang web" },
] as const;

export function SiteFooter() {
  return (
    <motion.footer
      className="relative border-t border-border bg-muted/30 dark:border-white/10 dark:bg-[oklch(0.09_0.03_285/0.85)]"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-32px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.25] dark:hidden"
        style={{
          backgroundImage:
            "radial-gradient(oklch(0 0 0 / 0.06) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden opacity-[0.35] dark:block"
        style={{
          backgroundImage:
            "radial-gradient(oklch(1 0 0 / 0.06) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 py-12 sm:py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
          <div className="max-w-md">
            <p className="font-heading text-xl font-bold tracking-tight text-foreground">
              Pháp lý rõ ràng hơn cho mọi người.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Tra cứu có nguồn, thảo luận có ngữ cảnh, blog đã kiểm chứng — luôn
              là tham khảo, không thay tư vấn luật sư.
            </p>
            <div className="mt-5 flex gap-2">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16 md:flex md:gap-20">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sản phẩm
              </p>
              <ul className="mt-3 space-y-2.5">
                {footerProduct.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-foreground/90 hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Pháp lý
              </p>
              <ul className="mt-3 space-y-2.5">
                {footerLegal.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-foreground/90 hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="my-10 h-px bg-white/10" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background/80">
              <MailIcon className="size-3.5 text-primary" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Liên hệ
              </p>
              <p className="mt-0.5 text-sm text-foreground">
                support@lawyerai.vn
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteName}
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
