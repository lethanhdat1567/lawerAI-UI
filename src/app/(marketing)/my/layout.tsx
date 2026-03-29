// src/app/(marketing)/my/layout.tsx
import { MyAuthGuard } from "@/app/(marketing)/my/_components/myAuthGuard";
import { MyShell } from "@/app/(marketing)/my/_components/myShell";

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
