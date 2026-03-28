// src/components/article/article-body.tsx — rich text nhẹ (**đậm**, đoạn) dùng chung Hub / Blog
import type { ReactNode } from "react";
import { Fragment } from "react";

function formatInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {m[1]}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function ArticleBody({ body }: { body: string }) {
  const blocks = body.trim().split(/\n\n+/);

  return (
    <div className="text-base leading-relaxed text-foreground/90 sm:text-[1.0625rem]">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        return (
          <p key={i} className="mb-5 last:mb-0">
            {lines.map((line, li) => (
              <span key={li}>
                {formatInline(line)}
                {li < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
