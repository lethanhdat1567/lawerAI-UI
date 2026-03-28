import {
  initializeApp,
  getApps,
  type FirebaseApp,
  type FirebaseOptions,
} from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

/** Tránh lỗi do khoảng trắng / dấu ngoặc trong `.env` khiến apiKey không khớp project. */
function cleanEnv(value: string | undefined): string | undefined {
  if (value == null) return undefined;
  const t = value.trim().replace(/^["']|["']$/g, "");
  return t || undefined;
}

function buildFirebaseConfig(): FirebaseOptions {
  const apiKey = cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  const authDomain = cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  const projectId = cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  const storageBucket = cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  );
  const messagingSenderId = cleanEnv(
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  );
  const appId = cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
  if (!apiKey || !authDomain || !projectId) {
    throw new Error(
      "Thiếu NEXT_PUBLIC_FIREBASE_API_KEY / AUTH_DOMAIN / PROJECT_ID.",
    );
  }
  return {
    apiKey,
    authDomain,
    projectId,
    ...(storageBucket ? { storageBucket } : {}),
    ...(messagingSenderId ? { messagingSenderId } : {}),
    ...(appId ? { appId } : {}),
  };
}

export function isFirebaseConfigured(): boolean {
  const apiKey = cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  const authDomain = cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  const projectId = cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  return Boolean(apiKey && authDomain && projectId);
}

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase chưa cấu hình (NEXT_PUBLIC_FIREBASE_*).");
  }
  if (!getApps().length) {
    return initializeApp(buildFirebaseConfig());
  }
  return getApps()[0]!;
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export const googleAuthProvider = new GoogleAuthProvider();
