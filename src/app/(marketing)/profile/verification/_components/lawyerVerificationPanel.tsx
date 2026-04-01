"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeftIcon, RefreshCcwIcon, ScaleIcon } from "lucide-react";

import { LawyerVerificationStatusBadge } from "@/app/(marketing)/profile/_components/lawyerVerificationStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/errors";
import {
  lawyerVerificationCreate,
  lawyerVerificationMe,
  lawyerVerificationUpdate,
  type LawyerVerificationRecord,
} from "@/lib/user/lawyerVerificationApi";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth/authService";
import { useAuthStore } from "@/stores/auth-store";

type FormState = {
  jurisdiction: string;
  barNumber: string;
  firmName: string;
};

function toFormState(record: LawyerVerificationRecord | null): FormState {
  return {
    jurisdiction: record?.jurisdiction ?? "",
    barNumber: record?.barNumber ?? "",
    firmName: record?.firmName ?? "",
  };
}

function formatWhen(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN");
  } catch {
    return iso;
  }
}

function summaryCopy(status: LawyerVerificationRecord["status"] | null): string {
  switch (status) {
    case "PENDING":
      return "Hồ sơ của bạn đang chờ admin xét duyệt. Bạn vẫn có thể cập nhật lại thông tin trước khi có quyết định cuối cùng.";
    case "REJECTED":
      return "Hồ sơ đã bị từ chối. Hãy chỉnh sửa theo ghi chú của admin rồi gửi lại để quay về trạng thái chờ duyệt.";
    case "APPROVED":
      return "Tài khoản của bạn đã được gắn trạng thái luật sư đã xác minh.";
    case "REVOKED":
      return "Xác minh đã bị thu hồi. Hiện trang này chỉ hiển thị hồ sơ cũ để bạn theo dõi trạng thái.";
    default:
      return "Điền thông tin hành nghề để gửi hồ sơ xác minh luật sư. Đội ngũ quản trị sẽ duyệt thủ công.";
  }
}

export function LawyerVerificationPanel() {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);

  const [meLoaded, setMeLoaded] = useState(false);
  const [verification, setVerification] = useState<LawyerVerificationRecord | null>(
    null,
  );
  const [form, setForm] = useState<FormState>(toFormState(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    setLoading(true);
    setBanner(null);

    (async () => {
      try {
        const { user } = await authService.me();
        if (cancelled) return;
        if (!user) {
          router.replace(`/login?next=${encodeURIComponent("/profile/verification")}`);
          return;
        }
        setMeLoaded(true);

        const { verification } = await lawyerVerificationMe();
        if (cancelled) return;
        setVerification(verification);
        setForm(toFormState(verification));
      } catch (err) {
        if (cancelled) return;
        const text =
          err instanceof ApiError
            ? err.message
            : "Không tải được hồ sơ xác minh. Thử lại sau.";
        setBanner({ type: "err", text });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, router]);

  const canEdit =
    verification == null ||
    verification.status === "PENDING" ||
    verification.status === "REJECTED";

  const submitLabel = useMemo(() => {
    if (verification == null) return "Gửi hồ sơ xác minh";
    if (verification.status === "REJECTED") return "Cập nhật và gửi lại";
    return "Lưu cập nhật";
  }, [verification]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function reloadVerification() {
    const { verification } = await lawyerVerificationMe();
    setVerification(verification);
    setForm(toFormState(verification));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBanner(null);

    const jurisdiction = form.jurisdiction.trim();
    const barNumber = form.barNumber.trim();
    const firmName = form.firmName.trim();

    if (!jurisdiction || !barNumber) {
      setBanner({
        type: "err",
        text: "Jurisdiction và số hành nghề là bắt buộc.",
      });
      return;
    }

    setSaving(true);
    try {
      if (verification == null) {
        await lawyerVerificationCreate({
          jurisdiction,
          barNumber,
          firmName: firmName || null,
        });
        toast.success("Đã gửi hồ sơ xác minh.");
      } else {
        await lawyerVerificationUpdate({
          jurisdiction,
          barNumber,
          firmName: firmName || null,
        });
        toast.success(
          verification.status === "REJECTED"
            ? "Đã cập nhật và gửi lại hồ sơ."
            : "Đã cập nhật hồ sơ xác minh.",
        );
      }

      await reloadVerification();
      setBanner({
        type: "ok",
        text:
          verification?.status === "REJECTED"
            ? "Hồ sơ đã được gửi lại và đang chờ duyệt."
            : "Thông tin xác minh đã được lưu.",
      });
      router.refresh();
    } catch (err) {
      const text =
        err instanceof ApiError
          ? err.message
          : "Không thể lưu hồ sơ xác minh. Thử lại sau.";
      setBanner({ type: "err", text });
    } finally {
      setSaving(false);
    }
  }

  if (!hydrated || (loading && !meLoaded)) {
    return <p className="text-sm text-muted-foreground">Đang tải hồ sơ xác minh…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          render={<Link href="/profile" />}
        >
          <ArrowLeftIcon className="size-4" aria-hidden />
          Quay lại hồ sơ
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={loading}
          onClick={() => void reloadVerification()}
        >
          <RefreshCcwIcon className="size-4" aria-hidden />
          Tải lại
        </Button>
      </div>

      <section className="rounded-none border border-border bg-card/40 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <ScaleIcon className="size-4 text-primary" aria-hidden />
          <span className="font-medium text-foreground">Trạng thái xác minh</span>
          <LawyerVerificationStatusBadge status={verification?.status ?? null} />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {summaryCopy(verification?.status ?? null)}
        </p>
        {verification?.note?.trim() ? (
          <div className="mt-4 rounded-none border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium">Ghi chú từ admin</p>
            <p className="mt-1 whitespace-pre-wrap">{verification.note}</p>
          </div>
        ) : null}
        {verification ? (
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-none border border-border bg-background/70 px-3 py-2">
              <dt className="text-muted-foreground">Gửi lúc</dt>
              <dd className="mt-1 font-medium text-foreground">
                {formatWhen(verification.createdAt)}
              </dd>
            </div>
            <div className="rounded-none border border-border bg-background/70 px-3 py-2">
              <dt className="text-muted-foreground">Review gần nhất</dt>
              <dd className="mt-1 font-medium text-foreground">
                {formatWhen(verification.reviewedAt)}
              </dd>
            </div>
          </dl>
        ) : null}
      </section>

      {banner ? (
        <p
          className={cn(
            "text-sm",
            banner.type === "ok" ? "text-primary" : "text-destructive",
          )}
          role="status"
        >
          {banner.text}
        </p>
      ) : null}

      <section className="rounded-none border border-border bg-card/40 p-5">
        <div className="space-y-1">
          <h2 className="font-medium text-foreground">Thông tin hồ sơ</h2>
          <p className="text-sm text-muted-foreground">
            Jurisdiction và số hành nghề là bắt buộc. Admin sẽ dùng các thông tin
            này để xác minh thủ công.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="verification-jurisdiction"
              className="text-sm font-medium text-foreground"
            >
              Jurisdiction
            </label>
            <Input
              id="verification-jurisdiction"
              value={form.jurisdiction}
              disabled={!canEdit || saving}
              onChange={(e) => updateField("jurisdiction", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="verification-bar-number"
              className="text-sm font-medium text-foreground"
            >
              Số hành nghề
            </label>
            <Input
              id="verification-bar-number"
              value={form.barNumber}
              disabled={!canEdit || saving}
              onChange={(e) => updateField("barNumber", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="verification-firm-name"
              className="text-sm font-medium text-foreground"
            >
              Tên tổ chức / văn phòng luật
            </label>
            <Input
              id="verification-firm-name"
              value={form.firmName}
              disabled={!canEdit || saving}
              onChange={(e) => updateField("firmName", e.target.value)}
              placeholder="Không bắt buộc"
            />
          </div>

          {canEdit ? (
            <Button type="submit" disabled={saving}>
              {saving ? "Đang lưu…" : submitLabel}
            </Button>
          ) : (
            <div className="rounded-none border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              Hồ sơ ở trạng thái này không thể chỉnh sửa từ giao diện người dùng.
            </div>
          )}
        </form>
      </section>
    </div>
  );
}
