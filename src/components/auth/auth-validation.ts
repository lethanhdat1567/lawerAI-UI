// src/components/auth/auth-validation.ts

export const PASSWORD_MIN_LENGTH = 8;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Username: khớp BE — chữ, số, underscore; 3–32 ký tự */
const USERNAME_RE = /^[a-zA-Z0-9_]{3,32}$/;

export function isValidUsername(value: string): boolean {
  return USERNAME_RE.test(value.trim());
}
