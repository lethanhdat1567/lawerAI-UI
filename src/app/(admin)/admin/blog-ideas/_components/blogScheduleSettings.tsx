"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/errors";
import {
  blogScheduleToggleStatus,
  blogScheduleUpdate,
} from "@/services/blog-automation/blogScheduleApi";
import type { ScheduleBlogSystem } from "@/services/blog-automation/types";

import { buildScheduleModelSelectOptions } from "../_lib/scheduleModelSelectOptions";

const DEFAULT_SCHEDULE_MODEL = "gemini-2.5-flash";

const SCHEDULE_MODEL_OPTIONS: { value: string; label: string }[] = [
  { value: DEFAULT_SCHEDULE_MODEL, label: "gemini-2.5-flash" },
];

type BlogScheduleSettingsProps = {
  schedule: ScheduleBlogSystem | null;
  onScheduleChange: () => Promise<void>;
};

export function BlogScheduleSettings({
  schedule,
  onScheduleChange,
}: BlogScheduleSettingsProps) {
  const [model, setModel] = useState(DEFAULT_SCHEDULE_MODEL);
  const [prompt, setPrompt] = useState("");
  const [toggling, setToggling] = useState(false);
  const [saving, setSaving] = useState(false);

  const modelSelectOptions = useMemo(
    () => buildScheduleModelSelectOptions(SCHEDULE_MODEL_OPTIONS, schedule?.model),
    [schedule?.model],
  );

  useEffect(() => {
    if (!schedule) {
      setModel(DEFAULT_SCHEDULE_MODEL);
      setPrompt("");
      return;
    }
    setModel(schedule.model);
    setPrompt(schedule.prompt);
    // Đồng bộ lại sau khi lưu / refetch: `updatedAt` đổi dù `id` giữ nguyên.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule?.id, schedule?.updatedAt]);

  async function handleToggle(nextChecked: boolean) {
    if (!schedule) {
      return;
    }
    if (nextChecked === schedule.isActive) {
      return;
    }
    setToggling(true);
    try {
      await blogScheduleToggleStatus(schedule.id);
      toast.success(
        nextChecked
          ? "Đã bật lịch viết blog tự động."
          : "Đã tắt lịch viết blog tự động.",
      );
      await onScheduleChange();
    } catch (e) {
      toast.error(
        e instanceof ApiError
          ? e.message
          : "Không cập nhật được trạng thái lịch.",
      );
    } finally {
      setToggling(false);
    }
  }

  async function handleSaveConfig() {
    if (!schedule) {
      toast.error("Chưa có bản ghi lịch trong hệ thống.");
      return;
    }
    const trimmed = prompt.trim();
    if (!trimmed) {
      toast.error("Prompt không được để trống.");
      return;
    }
    setSaving(true);
    try {
      await blogScheduleUpdate(schedule.id, { model, prompt: trimmed });
      toast.success("Đã lưu cấu hình lịch.");
      await onScheduleChange();
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "Lưu cấu hình lịch thất bại.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="w-full min-w-0">
      <CardHeader>
        <CardTitle>Lịch viết blog tự động</CardTitle>
        <CardDescription>
          Bật hoặc tắt tính năng, chọn model và prompt dùng khi hệ thống chạy
          lịch.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!schedule ? (
          <p className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            Chưa có bản ghi{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              schedule_blog_system
            </code>{" "}
            trong database. Hãy tạo một dòng (ví dụ qua Prisma Studio hoặc SQL)
            để dùng toggle và lưu cấu hình.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">
              Trạng thái lịch
            </p>
            <p className="text-xs text-muted-foreground">
              {schedule?.isActive ? "Đang bật" : "Đang tắt"}
            </p>
          </div>
          <Switch
            checked={schedule?.isActive ?? false}
            disabled={!schedule || toggling}
            onCheckedChange={(checked) => void handleToggle(checked)}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="schedule-model"
            className="text-sm font-medium text-foreground"
          >
            Model
          </label>
          {schedule &&
          !SCHEDULE_MODEL_OPTIONS.some((o) => o.value === schedule.model) ? (
            <p className="text-xs text-muted-foreground">
              Trên DB đang lưu model không nằm trong danh sách chuẩn. Chọn model đúng rồi bấm Lưu để
              cập nhật.
            </p>
          ) : null}
          <Select
            id="schedule-model"
            value={model}
            disabled={!schedule}
            onChange={(e) => setModel(e.target.value)}
          >
            {modelSelectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="schedule-prompt"
            className="text-sm font-medium text-foreground"
          >
            Prompt lịch tự động
          </label>
          <Textarea
            id="schedule-prompt"
            value={prompt}
            disabled={!schedule}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Chủ đề / hướng dẫn cho AI khi chạy theo lịch..."
            rows={4}
          />
        </div>

        <Button
          type="button"
          disabled={!schedule || saving}
          onClick={() => void handleSaveConfig()}
        >
          {saving ? "Đang lưu…" : "Lưu cấu hình"}
        </Button>
      </CardContent>
    </Card>
  );
}
