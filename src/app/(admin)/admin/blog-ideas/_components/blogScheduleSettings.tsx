"use client";

import { useEffect, useMemo, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/errors";
import {
  blogScheduleListModels,
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
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const [prompt, setPrompt] = useState("");
  const [toggling, setToggling] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dynamicModels, setDynamicModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadModels() {
      setIsLoadingModels(true);
      try {
        const models = await blogScheduleListModels();
        if (!isMounted) {
          return;
        }
        setDynamicModels(models);
      } catch {
        if (!isMounted) {
          return;
        }
        toast.error("Không tải được danh sách model từ AI Gateway.");
      } finally {
        if (isMounted) {
          setIsLoadingModels(false);
        }
      }
    }

    void loadModels();
    return () => {
      isMounted = false;
    };
  }, []);

  const baseModelOptions = useMemo(
    () =>
      dynamicModels.length > 0
        ? dynamicModels.map((value) => ({ value, label: value }))
        : SCHEDULE_MODEL_OPTIONS,
    [dynamicModels],
  );

  const modelSelectOptions = useMemo(
    () => buildScheduleModelSelectOptions(baseModelOptions, schedule?.model),
    [baseModelOptions, schedule?.model],
  );

  const filteredModelOptions = useMemo(() => {
    const keyword = modelSearch.trim().toLowerCase();
    if (!keyword) {
      return modelSelectOptions;
    }
    return modelSelectOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(keyword) ||
        option.value.toLowerCase().includes(keyword),
    );
  }, [modelSearch, modelSelectOptions]);

  const hasNoModelMatch = filteredModelOptions.length === 0;
  const modelOptionExists = filteredModelOptions.some(
    (option) => option.value === model,
  );
  const selectedModelValue = modelOptionExists
    ? model
    : (filteredModelOptions[0]?.value ?? model);

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
            className="data-checked:bg-emerald-500 dark:data-checked:bg-emerald-400"
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
              Hãy chọn model mà bạn yêu thích.
            </p>
          ) : null}

          {isLoadingModels ? (
            <p className="text-xs text-muted-foreground">
              Đang tải danh sách model từ AI Gateway...
            </p>
          ) : null}
          {hasNoModelMatch ? (
            <p className="text-xs text-muted-foreground">
              Không có model nào khớp với từ khóa tìm kiếm.
            </p>
          ) : null}
          <Popover.Root
            open={isModelPickerOpen}
            onOpenChange={(nextOpen) => {
              setIsModelPickerOpen(nextOpen);
              if (!nextOpen) {
                setModelSearch("");
              }
            }}
          >
            <Popover.Trigger asChild>
              <Button
                id="schedule-model"
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={isModelPickerOpen}
                disabled={!schedule}
                className="w-full justify-between"
              >
                <span className="truncate">
                  {modelSelectOptions.find(
                    (opt) => opt.value === selectedModelValue,
                  )?.label ?? "Chọn model"}
                </span>
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-60" />
              </Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                sideOffset={6}
                align="start"
                className="z-50 w-(--radix-popover-trigger-width) rounded-lg border bg-popover p-2 shadow-md outline-none"
              >
                <Input
                  autoFocus
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  placeholder="Tìm model..."
                />
                <div className="mt-2 max-h-64 overflow-auto">
                  {hasNoModelMatch ? (
                    <p className="px-2 py-1.5 text-sm text-muted-foreground">
                      Không có model nào khớp.
                    </p>
                  ) : (
                    filteredModelOptions.map((opt) => {
                      const isSelected = model === opt.value;
                      return (
                        <Button
                          key={opt.value}
                          type="button"
                          variant="ghost"
                          className="h-8 w-full justify-start px-2"
                          onClick={() => {
                            setModel(opt.value);
                            setIsModelPickerOpen(false);
                            setModelSearch("");
                          }}
                        >
                          <Check
                            className={`mr-2 size-4 ${
                              isSelected ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          <span className="truncate">{opt.label}</span>
                        </Button>
                      );
                    })
                  )}
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
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
