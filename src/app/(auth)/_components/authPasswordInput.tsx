// src/components/auth/auth-password-input.tsx
"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type AuthPasswordInputProps = Omit<
  React.ComponentPropsWithRef<"input">,
  "type"
>;

export const AuthPasswordInput = React.forwardRef<
  HTMLInputElement,
  AuthPasswordInputProps
>(function AuthPasswordInput(
  {
    id: idProp,
    name = "password",
    autoComplete = "current-password",
    className,
    ...rest
  },
  ref,
) {
  const genId = useId();
  const id = idProp ?? genId;
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        className={cn("h-10 pr-11 md:h-10", className)}
        {...rest}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      >
        {visible ? (
          <EyeOffIcon className="size-4" aria-hidden />
        ) : (
          <EyeIcon className="size-4" aria-hidden />
        )}
      </Button>
    </div>
  );
});
