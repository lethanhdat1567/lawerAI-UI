export type ScheduleModelOption = { value: string; label: string };

/**
 * Nếu DB đang lưu model không nằm trong danh sách chuẩn (vd. "test"), thêm một option
 * để `<select value={...}>` khớp option — tránh state lệch và mỗi lần Lưu lại gửi nhầm giá trị cũ.
 */
export function buildScheduleModelSelectOptions(
  known: ScheduleModelOption[],
  serverModel: string | null | undefined,
): ScheduleModelOption[] {
  const sm = serverModel?.trim();
  if (!sm || known.some((o) => o.value === sm)) {
    return known;
  }
  return [{ value: sm, label: `${sm} (đang lưu DB)` }, ...known];
}
