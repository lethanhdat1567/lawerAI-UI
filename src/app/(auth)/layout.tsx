// src/app/(auth)/layout.tsx
import { AuthSplitLayout } from "@/app/(auth)/_components/authSplitLayout";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <AuthSplitLayout>{children}</AuthSplitLayout>;
}
