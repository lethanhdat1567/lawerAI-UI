export function AssistantGuestNotice() {
  return (
    <div className="border-b border-border/60 bg-background px-4 py-4">
      <div className="space-y-2 border border-dashed border-border/70 px-3 py-3">
        <p className="text-sm font-medium">Bạn đang ở chế độ khách</p>
        <p className="text-sm text-muted-foreground">
          Lịch sử chat sẽ không được lưu khi chưa đăng nhập.
        </p>
      </div>
    </div>
  );
}
