"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ChevronRightIcon, ScaleIcon } from "lucide-react";

import { AuthField } from "@/app/(auth)/_components/authField";
import { LawyerVerificationStatusBadge } from "@/app/(marketing)/profile/_components/lawyerVerificationStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/errors";
import { resolveApiAssetUrl } from "@/lib/media/resolveApiAssetUrl";
import {
  lawyerVerificationMe,
  type LawyerVerificationRecord,
} from "@/lib/user/lawyerVerificationApi";
import {
  profileFormSchema,
  type ProfileFormValues,
} from "@/lib/validators/profileForm";
import { cn } from "@/lib/utils";
import { authService } from "@/services/auth/authService";
import type { PublicUser } from "@/services/auth/authTypes";
import { useAuthStore } from "@/stores/auth-store";

function toFormDefaults(u: PublicUser): ProfileFormValues {
  return {
    username: u.username ?? "",
    displayName: u.profile.displayName ?? "",
    bio: u.profile.bio ?? "",
    avatarUrl: u.profile.avatarUrl ?? "",
    contributorOptOut: u.profile.contributorOptOut,
  };
}

export function ProfileForm() {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const setUser = useAuthStore((s) => s.setUser);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [meUser, setMeUser] = useState<PublicUser | null>(null);
  const [banner, setBanner] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);
  const [verification, setVerification] = useState<LawyerVerificationRecord | null>(
    null,
  );
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      displayName: "",
      bio: "",
      avatarUrl: "",
      contributorOptOut: false,
    },
  });

  const avatarPath = watch("avatarUrl");
  const previewSrc = resolveApiAssetUrl(avatarPath);

  useEffect(() => {
    if (!hydrated) return;
    setLoadError(null);
    let cancelled = false;
    (async () => {
      try {
        const { user } = await authService.me();
        if (cancelled) return;
        if (!user) {
          router.replace(`/login?next=${encodeURIComponent("/profile")}`);
          return;
        }
        setUser(user);
        setMeUser(user);
        reset(toFormDefaults(user));
        try {
          const { verification } = await lawyerVerificationMe();
          if (!cancelled) {
            setVerification(verification);
            setVerificationError(null);
          }
        } catch {
          if (!cancelled) {
            setVerification(null);
            setVerificationError("Không tải được trạng thái xác minh luật sư.");
          }
        }
      } catch {
        if (!cancelled) {
          setLoadError("Không tải được hồ sơ. Thử làm mới trang.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated, router, reset, setUser]);

  async function onAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBanner(null);
    setUploading(true);
    try {
      const { url } = await authService.uploadImage(file);
      setValue("avatarUrl", url, { shouldValidate: true, shouldDirty: true });
    } catch (err) {
      const text =
        err instanceof ApiError ? err.message : "Upload ảnh thất bại.";
      setBanner({ type: "err", text });
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(data: ProfileFormValues) {
    setBanner(null);
    try {
      const { user } = await authService.updateProfile({
        username: data.username.trim(),
        displayName: data.displayName.trim() || null,
        bio: data.bio.trim() || null,
        avatarUrl: data.avatarUrl.trim() || null,
        contributorOptOut: data.contributorOptOut,
      });
      setUser(user);
      setMeUser(user);
      reset(toFormDefaults(user));
      setBanner({ type: "ok", text: "Đã lưu hồ sơ." });
      toast.success("Đã lưu hồ sơ.");
      router.refresh();
    } catch (err) {
      const text =
        err instanceof ApiError ? err.message : "Lưu thất bại. Thử lại sau.";
      setBanner({ type: "err", text });
    }
  }

  if (!hydrated) {
    return (
      <p className="text-sm text-muted-foreground">Đang tải phiên đăng nhập…</p>
    );
  }

  if (!meUser) {
    return loadError ? (
      <p className="text-sm text-destructive" role="alert">
        {loadError}
      </p>
    ) : (
      <p className="text-sm text-muted-foreground">Đang tải hồ sơ…</p>
    );
  }

  const verified = Boolean(meUser.emailVerifiedAt);
  const verificationHref = "/profile/verification";
  const verificationActionLabel =
    verification == null
      ? "Gửi hồ sơ xác minh"
      : verification.status === "REJECTED"
        ? "Cập nhật và gửi lại"
        : verification.status === "PENDING"
          ? "Xem hồ sơ đang chờ duyệt"
          : verification.status === "APPROVED"
            ? "Xem trạng thái xác minh"
            : "Xem chi tiết xác minh";
  const verificationDescription =
    verification == null
      ? "Nộp thông tin hành nghề để đội ngũ quản trị xác minh và gắn badge luật sư đã xác minh."
      : verification.status === "PENDING"
        ? "Hồ sơ của bạn đã được gửi và đang chờ admin xét duyệt thủ công."
        : verification.status === "REJECTED"
          ? verification.note?.trim() ||
            "Hồ sơ cần bổ sung hoặc chỉnh sửa trước khi gửi lại."
          : verification.status === "APPROVED"
            ? "Tài khoản của bạn đã được xác minh tư cách luật sư."
            : verification.note?.trim() ||
              "Xác minh đã bị thu hồi. Vui lòng xem chi tiết để biết tình trạng hiện tại.";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="rounded-none border border-border bg-card/50 px-4 py-3 text-sm">
        <p>
          <span className="text-muted-foreground">Email: </span>
          <span className="font-medium text-foreground">{meUser.email}</span>
        </p>
        <p className="mt-1 text-muted-foreground">
          Trạng thái: {verified ? "Đã xác minh email" : "Chưa xác minh email"}
        </p>
      </div>
      <div className="rounded-none border border-border bg-card/50 px-4 py-4 text-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 font-medium text-foreground">
                <ScaleIcon className="size-4 text-primary" aria-hidden />
                Xác minh luật sư
              </span>
              <LawyerVerificationStatusBadge status={verification?.status ?? null} />
            </div>
            <p className="text-muted-foreground">{verificationDescription}</p>
            {verificationError ? (
              <p className="text-destructive" role="alert">
                {verificationError}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            render={<Link href={verificationHref} />}
          >
            {verificationActionLabel}
            <ChevronRightIcon className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
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

      <div className="flex flex-wrap items-end gap-4">
        <div
          className={cn(
            "flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-none border border-border bg-muted",
            previewSrc ? "p-0" : "p-4",
          )}
        >
          {previewSrc ? (
            <Image
              width={100}
              height={100}
              src={previewSrc}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span className="text-xs text-muted-foreground">Chưa có ảnh</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="sr-only"
            onChange={onAvatarPick}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? "Đang tải ảnh…" : "Chọn ảnh (upload)"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Ảnh được gửi lên server trước; sau đó bấm Lưu để gắn vào hồ sơ.
          </p>
        </div>
      </div>

      <AuthField
        label="Tên đăng nhập"
        htmlFor="profile-username"
        error={errors.username?.message}
      >
        <Input
          id="profile-username"
          autoComplete="username"
          {...register("username")}
        />
      </AuthField>

      <AuthField
        label="Tên hiển thị"
        htmlFor="profile-display"
        error={errors.displayName?.message}
      >
        <Input id="profile-display" {...register("displayName")} />
      </AuthField>

      <AuthField
        label="Giới thiệu"
        htmlFor="profile-bio"
        error={errors.bio?.message}
      >
        <textarea
          id="profile-bio"
          rows={4}
          className={cn(
            "border-input placeholder:text-muted-foreground flex w-full rounded-none border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          )}
          {...register("bio")}
        />
      </AuthField>

      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-1 size-4 rounded-none border border-input"
          {...register("contributorOptOut")}
        />
        <span>
          <span className="font-medium text-foreground">
            Ẩn danh trên bảng xếp hạng đóng góp
          </span>
          <span className="mt-1 block text-muted-foreground">
            Khi bật, tên và ảnh đại diện không hiện trên trang Contributors; bạn vẫn
            có thể giữ hạng và điểm hiển thị dưới dạng &quot;Thành viên ẩn danh&quot;.
          </span>
        </span>
      </label>

      <Button type="submit" disabled={isSubmitting || uploading}>
        {isSubmitting ? "Đang lưu…" : "Lưu hồ sơ"}
      </Button>
    </form>
  );
}
