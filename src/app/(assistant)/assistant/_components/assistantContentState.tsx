"use client";

interface AssistantContentStateProps {
  description: string;
  title: string;
}

export function AssistantContentState({
  description,
  title,
}: AssistantContentStateProps) {
  return (
    <div className="flex min-h-[420px] items-center justify-center px-6 text-center">
      <div className="space-y-3">
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </p>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}
