// src/components/auth/auth-page-layout.tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AuthPageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  variant?: "default" | "wide";
  footer?: ReactNode;
}

export function AuthPageLayout({
  title,
  description,
  children,
  variant = "default",
  footer,
}: AuthPageLayoutProps) {
  return (
    <div
      className={cn(
        "w-full",
        variant === "wide" ? "max-w-lg" : "max-w-[420px]",
      )}
    >
      <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
          {description}
        </p>
      ) : null}
      <div className="mt-10">{children}</div>
      {footer ? (
        <div className="mt-10 border-t border-border pt-6">{footer}</div>
      ) : null}
    </div>
  );
}
