"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  vscDarkPlus,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { cn } from "@/lib/utils";

interface AssistantMarkdownBlockProps {
  content: string;
  isStreaming: boolean;
  showStreamingCursor: boolean;
}

export function AssistantMarkdownBlock({
  content,
  isStreaming,
  showStreamingCursor,
}: AssistantMarkdownBlockProps) {
  const reduceMotion = useReducedMotion();
  const showTypingPlaceholder = !content && isStreaming;

  return (
    <div className="max-w-3xl text-sm leading-7 text-slate-800 dark:text-slate-200">
      {content ? (
        <Markdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
          {content}
        </Markdown>
      ) : showTypingPlaceholder ? (
        <TypingIndicator reduceMotion={Boolean(reduceMotion)} />
      ) : (
        <p className="text-slate-500 dark:text-slate-400">Đang trả lời</p>
      )}
      {showStreamingCursor ? <StreamingCursor reduceMotion={Boolean(reduceMotion)} /> : null}
    </div>
  );
}

function TypingIndicator({ reduceMotion }: { reduceMotion: boolean }) {
  if (reduceMotion) {
    return (
      <p className="text-slate-500 dark:text-slate-400">
        Đang trả lời
        <span className="sr-only">, vui lòng chờ.</span>
      </p>
    );
  }

  return (
    <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
      <span className="sr-only">Đang trả lời, vui lòng chờ.</span>
      <span aria-hidden className="inline-flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
            className="size-1.5 rounded-full bg-slate-400 dark:bg-slate-500"
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.14,
              ease: "easeInOut",
            }}
          />
        ))}
      </span>
    </p>
  );
}

function StreamingCursor({ reduceMotion }: { reduceMotion: boolean }) {
  if (reduceMotion) {
    return (
      <span
        aria-hidden
        className="ml-1 inline-block h-4 w-px bg-current align-middle opacity-80"
      />
    );
  }

  return (
    <span
      aria-hidden
      className="assistant-stream-cursor ml-1 inline-block h-4 w-[3px] shrink-0 rounded-full align-middle"
    />
  );
}

function MarkdownCode({ children, className, ...props }: MarkdownCodeProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const match = /language-(\w+)/.exec(className ?? "");
  const code = String(children).replace(/\n$/, "");
  const style = mounted && resolvedTheme === "dark" ? vscDarkPlus : oneLight;

  if (!match) {
    return (
      <code
        className="bg-slate-50 px-1.5 py-0.5 text-[0.9em] text-slate-800 dark:bg-white/5 dark:text-slate-200"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="group relative my-4 border border-black/3 dark:border-white/6">
      <SyntaxHighlighter
        PreTag="div"
        codeTagProps={{ className: "font-mono text-[13px]" }}
        customStyle={{
          background: "transparent",
          borderRadius: 0,
          margin: 0,
          padding: "1rem",
        }}
        language={match[1]}
        style={style}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function MarkdownParagraph({ children }: MarkdownComponentProps) {
  return (
    <p className="my-4 leading-7 text-slate-800 dark:text-slate-200">
      {children}
    </p>
  );
}

function MarkdownHeading({ children, level }: MarkdownHeadingProps) {
  const className = HEADING_CLASS_NAMES[level];
  const Tag = `h${level}` as HeadingTag;

  return <Tag className={className}>{children}</Tag>;
}

function MarkdownList({ children, ordered = false }: MarkdownListProps) {
  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag
      className={cn(
        "my-4 ml-5 space-y-3 text-slate-800 dark:text-slate-200",
        ordered
          ? "list-decimal"
          : "list-disc marker:text-slate-400 dark:marker:text-slate-500",
      )}
    >
      {children}
    </Tag>
  );
}

function MarkdownListItem({ children }: MarkdownComponentProps) {
  return <li className="pl-1 leading-relaxed">{children}</li>;
}

const HEADING_CLASS_NAMES = {
  1: "mt-5 mb-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100",
  2: "mt-5 mb-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100",
  3: "mt-4 mb-3 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100",
  4: "mt-4 mb-2 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100",
  5: "mt-3 mb-2 text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100",
  6: "mt-3 mb-2 text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100",
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
