"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AssistantContentStateProps {
  description: string;
  title: string;
}

export function AssistantContentState({
  description,
  title,
}: AssistantContentStateProps) {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 10 };

  return (
    <div className="flex min-h-[420px] items-center justify-center px-6 text-center">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
        initial={initial}
        transition={{
          duration: reduceMotion ? 0 : 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </p>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </motion.div>
    </div>
  );
}
