// src/components/layout/page-shell.tsx
import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:py-16 md:py-20">
      <div className="max-w-reading">
        <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight md:text-[2.65rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children ? <div className="mt-12 max-w-reading">{children}</div> : null}
    </div>
  );
}
