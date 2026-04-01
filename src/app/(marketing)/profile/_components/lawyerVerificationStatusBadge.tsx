"use client";

import { BadgeCheckIcon, Clock3Icon, ShieldAlertIcon, ShieldIcon, ShieldXIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { LawyerVerificationStatus } from "@/lib/user/lawyerVerificationApi";

const STATUS_META: Record<
  LawyerVerificationStatus,
  {
    label: string;
    className: string;
    Icon: typeof Clock3Icon;
  }
> = {
  PENDING: {
    label: "Đang chờ duyệt",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    Icon: Clock3Icon,
  },
  APPROVED: {
    label: "Luật sư đã xác minh",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    Icon: BadgeCheckIcon,
  },
  REJECTED: {
    label: "Bị từ chối",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
    Icon: ShieldXIcon,
  },
  REVOKED: {
    label: "Đã thu hồi xác minh",
    className: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
    Icon: ShieldAlertIcon,
  },
};

export function LawyerVerificationStatusBadge({
  status,
  pendingLabel = "Chưa gửi hồ sơ",
}: {
  status: LawyerVerificationStatus | null;
  pendingLabel?: string;
}) {
  if (!status) {
    return (
      <Badge
        variant="outline"
        className="border-border bg-background/80 text-muted-foreground"
      >
        <ShieldIcon className="size-3.5" aria-hidden />
        {pendingLabel}
      </Badge>
    );
  }

  const meta = STATUS_META[status];
  const Icon = meta.Icon;
  return (
    <Badge variant="outline" className={meta.className}>
      <Icon className="size-3.5" aria-hidden />
      {meta.label}
    </Badge>
  );
}
