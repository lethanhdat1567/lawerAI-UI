// src/components/motion/split-heading.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SplitHeadingProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function SplitHeading({ text, className, as: Tag = "h1" }: SplitHeadingProps) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block whitespace-nowrap">
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.5,
              delay: i * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? "\u00a0" : null}
        </span>
      ))}
    </Tag>
  );
}
