// src/app/(marketing)/my/layout.tsx
import { MyAuthGuard } from "@/app/(marketing)/my/_components/my-auth-guard";
import { MyShell } from "@/app/(marketing)/my/_components/my-shell";

export default function MyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MyAuthGuard>
      <MyShell>{children}</MyShell>
    </MyAuthGuard>
  );
}
