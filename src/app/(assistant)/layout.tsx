// src/app/(assistant)/layout.tsx
interface AssistantLayoutProps {
  children: React.ReactNode;
}

export default function AssistantLayout({ children }: AssistantLayoutProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground antialiased">
      {children}
    </div>
  );
}
