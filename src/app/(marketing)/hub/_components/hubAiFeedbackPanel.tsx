"use client";

import type { ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  if (!isCompletedMarkdown(feedback)) return null;

  return (
    <aside className="lg:sticky lg:top-24">
      <Card className="border border-border/70 shadow-sm">
        <CardHeader className="border-b border-border/70">
          <CardTitle>AI feedback</CardTitle>
          <CardDescription>
            Tóm tắt và gợi ý nhanh do AI phân tích từ nội dung bài đăng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="hub-ai-feedback-markdown text-sm leading-7 text-foreground">
            <Markdown
              components={markdownComponents}
              remarkPlugins={[remarkGfm]}
            >
              {feedback.rawResponse}
            </Markdown>
          </div>
        </CardContent>
      </Card>
    </aside>
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
