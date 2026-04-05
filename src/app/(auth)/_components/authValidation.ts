// src/components/auth/auth-validation.ts

export const PASSWORD_MIN_LENGTH = 8;

/** Mã đặt lại mật khẩu từ BE (randomNumericCode) — 6 chữ số */
export const RESET_CODE_LENGTH = 6;

const RESET_CODE_RE = new RegExp(`^\\d{${RESET_CODE_LENGTH}}$`);

export function isValidResetCode(value: string): boolean {
  return RESET_CODE_RE.test(value.trim());
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Username: khớp BE — chữ, số, underscore; 3–32 ký tự */
const USERNAME_RE = /^[a-zA-Z0-9_]{3,32}$/;

export function isValidUsername(value: string): boolean {
  return USERNAME_RE.test(value.trim());
}
