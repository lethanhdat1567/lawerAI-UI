import { z } from "zod";

function avatarRefine(s: string): boolean {
  const t = s.trim();
  if (t === "") return true;
  return t.startsWith("/upload/") || /^https?:\/\//i.test(t);
}

export const profileFormSchema = z.object({
  username: z
    .string()
    .min(1, "Nhập tên đăng nhập.")
    .min(3, "Tối thiểu 3 ký tự.")
    .max(32, "Tối đa 32 ký tự.")
    .regex(/^[a-zA-Z0-9_]+$/, "Chỉ dùng chữ, số và gạch dưới."),
  displayName: z.string().max(120, "Tối đa 120 ký tự."),
  bio: z.string().max(2000, "Tối đa 2000 ký tự."),
  avatarUrl: z
    .string()
    .max(2048)
    .refine(avatarRefine, "Ảnh đại diện phải từ upload hoặc URL http(s)."),
  contributorOptOut: z.boolean(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
