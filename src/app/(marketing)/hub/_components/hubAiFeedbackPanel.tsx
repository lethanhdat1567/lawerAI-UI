"use client";

import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import type { HubAiFeedback } from "@/lib/hub/types";

interface HubAiFeedbackPanelProps {
  feedback: HubAiFeedback | null;
}

function isCompletedMarkdown(
  feedback: HubAiFeedback | null,
): feedback is HubAiFeedback & { status: "COMPLETED"; rawResponse: string } {
  return (
    feedback?.status === "COMPLETED" &&
    typeof feedback.rawResponse === "string" &&
    feedback.rawResponse.trim().length > 0
  );
}

export function HubAiFeedbackPanel({ feedback }: HubAiFeedbackPanelProps) {
  if (feedback == null) {
    return null;
  }

  const isThinking =
    feedback.status === "PENDING" || feedback.status === "PROCESSING";
  const isFailed = feedback.status === "FAILED";
  const hasMarkdown = isCompletedMarkdown(feedback);
  const isEmptyCompleted =
    feedback.status === "COMPLETED" && !hasMarkdown;

  return (
    <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
      <HubAiFeedbackChrome>
        {isThinking ? <HubAiFeedbackThinking /> : null}
        {isFailed ? <HubAiFeedbackFailed /> : null}
        {hasMarkdown ? (
          <div className="hub-ai-feedback-markdown text-sm leading-7 text-foreground">
            <Markdown
              components={markdownComponents}
              remarkPlugins={[remarkGfm]}
            >
              {feedback.rawResponse}
            </Markdown>
          </div>
        ) : null}
        {isEmptyCompleted ? <HubAiFeedbackEmpty /> : null}
      </HubAiFeedbackChrome>
    </aside>
  );
}

function HubAiFeedbackChrome({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/70 bg-card",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]",
        "dark:border-white/10 dark:bg-card/90 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_12px_40px_-16px_rgba(0,0,0,0.5)]",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary/0 via-primary/35 to-primary/0 dark:via-primary/40"
      />
      <div className="relative border-b border-border/60 bg-linear-to-b from-muted/50 to-muted/20 px-5 py-4 dark:from-white/4 dark:to-transparent">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl",
              "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/10",
              "dark:bg-primary/15 dark:ring-primary/20",
            )}
          >
            <Sparkles className="size-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1 pt-0.5">
            <h2 className="font-heading text-base font-semibold tracking-tight text-foreground">
              Phản hồi AI
            </h2>
            <p className="text-sm leading-snug text-muted-foreground">
              Tóm tắt và gợi ý nhanh do AI phân tích từ nội dung bài đăng.
            </p>
          </div>
        </div>
      </div>
      <div className="relative px-5 py-5">{children}</div>
    </div>
  );
}

function HubAiFeedbackThinking() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-8 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/80 dark:bg-white/5">
        <Loader2
          className="size-7 animate-spin text-primary"
          aria-hidden
        />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">
          AI đang suy nghĩ để trả lời feedback của bạn…
        </p>
        <p className="mx-auto max-w-[260px] text-xs leading-relaxed text-muted-foreground">
          Quá trình có thể mất vài phút. Bạn có thể tải lại trang sau để xem kết
          quả.
        </p>
      </div>
    </div>
  );
}

function HubAiFeedbackFailed() {
  return (
    <div
      className="flex gap-3 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive dark:border-destructive/30 dark:bg-destructive/10"
      role="alert"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p className="leading-relaxed">
        Không tạo được phản hồi AI lúc này. Vui lòng thử tải lại trang sau.
      </p>
    </div>
  );
}

function HubAiFeedbackEmpty() {
  return (
    <p className="py-2 text-center text-sm text-muted-foreground">
      Chưa có nội dung phản hồi từ AI.
    </p>
  );
}

function MarkdownParagraph({ children }: MarkdownComponentProps) {
  return <p className="my-3 leading-7">{children}</p>;
}

function MarkdownHeading({ children, level }: MarkdownHeadingProps) {
  const Tag = `h${level}` as HeadingTag;
  return <Tag className={HEADING_CLASS_NAMES[level]}>{children}</Tag>;
}

function MarkdownList({ children, ordered = false }: MarkdownListProps) {
  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag
      className={
        ordered
          ? "my-3 ml-5 list-decimal space-y-2"
          : "my-3 ml-5 list-disc space-y-2"
      }
    >
      {children}
    </Tag>
  );
}

function MarkdownListItem({ children }: MarkdownComponentProps) {
  return <li className="pl-1">{children}</li>;
}

function MarkdownCode({ children, className, ...props }: MarkdownCodeProps) {
  if (className?.includes("language-")) {
    return (
      <pre className="my-4 overflow-x-auto rounded-lg bg-muted px-4 py-3 text-xs leading-6">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  }

  return (
    <code className="rounded bg-muted px-1.5 py-0.5 text-[0.9em]" {...props}>
      {children}
    </code>
  );
}

const HEADING_CLASS_NAMES = {
  1: "mt-5 mb-3 text-2xl font-semibold tracking-tight",
  2: "mt-5 mb-3 text-xl font-semibold tracking-tight",
  3: "mt-4 mb-2 text-lg font-semibold tracking-tight",
  4: "mt-4 mb-2 text-base font-semibold tracking-tight",
  5: "mt-3 mb-2 text-sm font-semibold tracking-tight",
  6: "mt-3 mb-2 text-sm font-semibold tracking-tight",
} as const;

const markdownComponents = {
  code: MarkdownCode,
  h1: ({ children }: MarkdownComponentProps) => (
    <MarkdownHeading level={1}>{children}</MarkdownHeading>
  ),
  h2: ({ children }: MarkdownComponentProps) => (
    <MarkdownHeading level={2}>{children}</MarkdownHeading>
  ),
  h3: ({ children }: MarkdownComponentProps) => (
    <MarkdownHeading level={3}>{children}</MarkdownHeading>
  ),
  h4: ({ children }: MarkdownComponentProps) => (
    <MarkdownHeading level={4}>{children}</MarkdownHeading>
  ),
  h5: ({ children }: MarkdownComponentProps) => (
    <MarkdownHeading level={5}>{children}</MarkdownHeading>
  ),
  h6: ({ children }: MarkdownComponentProps) => (
    <MarkdownHeading level={6}>{children}</MarkdownHeading>
  ),
  li: MarkdownListItem,
  ol: ({ children }: MarkdownComponentProps) => (
    <MarkdownList ordered>{children}</MarkdownList>
  ),
  p: MarkdownParagraph,
  ul: ({ children }: MarkdownComponentProps) => (
    <MarkdownList>{children}</MarkdownList>
  ),
};

interface MarkdownComponentProps {
  children?: ReactNode;
}

interface MarkdownHeadingProps extends MarkdownComponentProps {
  level: keyof typeof HEADING_CLASS_NAMES;
}

interface MarkdownListProps extends MarkdownComponentProps {
  ordered?: boolean;
}

interface MarkdownCodeProps extends MarkdownComponentProps {
  className?: string;
}

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
