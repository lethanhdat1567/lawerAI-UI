// src/app/(marketing)/blog/_components/blogPageLayout.tsx
import type { ReactNode } from "react";

interface BlogPageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function BlogPageLayout({
  title,
  description,
  children,
}: BlogPageLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16 md:py-20">
      <div className="max-w-3xl">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-[2.65rem] md:leading-tight">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      <div className="mt-10">{children}</div>
    </div>
  );
}
