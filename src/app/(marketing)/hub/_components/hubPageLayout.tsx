// src/app/(marketing)/hub/_components/hubPageLayout.tsx
import type { ReactNode } from "react";

interface HubPageLayoutProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function HubPageLayout({
  title,
  description,
  action,
  children,
}: HubPageLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16 md:py-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
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
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="mt-10">{children}</div>
    </div>
  );
}
