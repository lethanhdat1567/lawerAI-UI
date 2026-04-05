// src/components/marketing/trusted-strip.tsx
"use client";

import {
  BookOpenIcon,
  BuildingIcon,
  GraduationCapIcon,
  HeartHandshakeIcon,
  RocketIcon,
  UsersIcon,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";

const placeholderOrgs = [
  { name: "Cộng đồng pháp lý", icon: UsersIcon },
  { name: "Sinh viên luật", icon: GraduationCapIcon },
  { name: "Startup VN", icon: RocketIcon },
  { name: "Độc giả blog", icon: BookOpenIcon },
  { name: "Luật sư", icon: HeartHandshakeIcon },
  { name: "Trung tâm tư vấn", icon: BuildingIcon },
] as const;

export function TrustedStrip() {
  const reduceMotion = useReducedMotion();
  const loopItems = [...placeholderOrgs, ...placeholderOrgs];

  return (
    <section className="border-b border-border py-9 sm:py-10">
      <div className="mx-auto max-w-6xl px-5">
        <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Cộng đồng đồng hành
        </p>

        {reduceMotion ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {placeholderOrgs.map(({ name, icon: Icon }) => (
              <span
                key={name}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground"
              >
                <Icon className="size-3.5 text-primary/80" aria-hidden />
                {name}
              </span>
            ))}
          </div>
        ) : (
          <div
            className="relative mt-6 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="flex w-max animate-marquee-slow gap-0">
              {loopItems.map(({ name, icon: Icon }, i) => (
                <span
                  key={`${name}-${i}`}
                  className="flex shrink-0 items-center gap-10 pr-10"
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground">
                    <Icon
                      className="size-3.5 shrink-0 text-primary/70"
                      aria-hidden
                    />
                    {name}
                  </span>
                  <span
                    className="select-none text-muted-foreground/35"
                    aria-hidden
                  >
                    ·
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
