import { apiRequest } from "@/lib/api/http.client";

export type LawyerVerificationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "REVOKED";

export type LawyerVerificationReviewer = {
  email: string;
  username: string | null;
} | null;

export type LawyerVerificationUser = {
  id: string;
  email: string;
  role: string;
  username: string | null;
  displayName: string | null;
};

export type LawyerVerificationRecord = {
  id: string;
  userId: string;
  status: LawyerVerificationStatus;
  jurisdiction: string | null;
  barNumber: string | null;
  firmName: string | null;
  note: string | null;
  reviewedAt: string | null;
  reviewedByUserId: string | null;
  createdAt: string;
  updatedAt: string;
  user: LawyerVerificationUser;
  reviewedBy: LawyerVerificationReviewer;
};

export async function lawyerVerificationMe() {
  return apiRequest<{ verification: LawyerVerificationRecord | null }>(
    "/api/v1/lawyer-verifications/me",
  );
}

export async function lawyerVerificationCreate(body: {
  jurisdiction: string;
  barNumber: string;
  firmName?: string | null;
}) {
  return apiRequest<{ verification: LawyerVerificationRecord }>(
    "/api/v1/lawyer-verifications/me",
    {
      method: "POST",
      body,
    },
  );
}

export async function lawyerVerificationUpdate(body: {
  jurisdiction?: string;
  barNumber?: string;
  firmName?: string | null;
}) {
  return apiRequest<{ verification: LawyerVerificationRecord }>(
    "/api/v1/lawyer-verifications/me",
    {
      method: "PATCH",
      body,
    },
  );
}
