import { z } from "zod";

/** Form đăng ký — các trường gửi BE: email, password, username (khớp LawyerAI-api). */
export const registerFormSchema = z
  .object({
    email: z
      .string()
      .min(1, "Nhập email.")
      .email("Email không hợp lệ.")
      .max(320, "Email quá dài."),
    username: z
      .string()
      .min(1, "Nhập tên đăng nhập.")
      .min(3, "Tên đăng nhập tối thiểu 3 ký tự.")
      .max(32, "Tên đăng nhập tối đa 32 ký tự.")
      .regex(/^[a-zA-Z0-9_]+$/, "Chỉ dùng chữ, số và gạch dưới."),
    displayName: z
      .string()
      .max(80, "Tên hiển thị tối đa 80 ký tự."),
    password: z
      .string()
      .min(1, "Nhập mật khẩu.")
      .min(8, "Mật khẩu tối thiểu 8 ký tự.")
      .max(128, "Mật khẩu tối đa 128 ký tự."),
    confirmPassword: z.string().min(1, "Nhập lại mật khẩu."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp.",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
