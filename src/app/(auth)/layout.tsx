// src/app/(auth)/layout.tsx
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <AuthSplitLayout>{children}</AuthSplitLayout>;
}
