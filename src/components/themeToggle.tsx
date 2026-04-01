// src/components/theme-toggle.tsx
"use client";

import { useEffect, useState } from "react";
import { CheckIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="size-9 shrink-0"
        disabled
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="size-9 shrink-0 text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
    >
      {isDark ? <SunIcon className="size-4.5" /> : <MoonIcon className="size-4.5" />}
    </Button>
  );
}

export function ThemeMenuItems({ className }: ThemeMenuItemsProps) {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        {THEME_MENU_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className={cn(
              "rounded-none text-muted-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            disabled
          >
            <option.icon className="size-4" />
            {option.label}
          </DropdownMenuItem>
        ))}
      </>
    );
  }

  return (
    <>
      {THEME_MENU_OPTIONS.map((option) => {
        const isActive =
          option.value === "system"
            ? theme === "system"
            : resolvedTheme === option.value && theme !== "system";

        return (
          <DropdownMenuItem
            key={option.value}
            className={cn(
              "rounded-none text-muted-foreground focus:bg-accent focus:text-accent-foreground",
              isActive ? "bg-accent/60 text-foreground" : "",
              className,
            )}
            onClick={() => setTheme(option.value)}
          >
            <option.icon className="size-4" />
            <span className="flex-1">{option.label}</span>
            {isActive ? <CheckIcon className="size-4" /> : null}
          </DropdownMenuItem>
        );
      })}
    </>
  );
}

const THEME_MENU_OPTIONS = [
  { icon: SunIcon, label: "Sáng", value: "light" },
  { icon: MoonIcon, label: "Tối", value: "dark" },
  { icon: SunIcon, label: "Hệ thống", value: "system" },
] as const;

interface ThemeMenuItemsProps {
  className?: string;
}
