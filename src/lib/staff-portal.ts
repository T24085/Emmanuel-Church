import type { Timestamp } from "firebase/firestore";

export const resourceCategories = [
  "Shared folders",
  "Sunday service",
  "Ministries",
  "Office & planning",
] as const;
export const requestCategories = [
  "Website update",
  "Event or announcement",
  "Photos or documents",
  "General message",
] as const;
export const requestStatuses = [
  "New",
  "In review",
  "Waiting on staff",
  "Completed",
] as const;

export type StaffAccess = {
  email: string;
  // Optional trusted approval of this exact Firebase account without an email link.
  uid?: string;
  name: string;
  role: "admin" | "staff";
  active: boolean;
};
export type StaffResource = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  archived: boolean;
};
export type StaffRequest = {
  id: string;
  title: string;
  body: string;
  category: string;
  status: string;
  referenceUrl: string;
  neededBy: string;
  createdBy: string;
  authorEmail: string;
  authorName: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};
export type StaffMessage = {
  id: string;
  body: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp | null;
};
export type StaffNotice = {
  title: string;
  body: string;
  updatedAt?: Timestamp | null;
};

export function safeStaffUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function staffDate(value: Timestamp | null | undefined) {
  return value?.toDate
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(value.toDate())
    : "Just now";
}

export function staffError(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "";
  if (
    [
      "auth/invalid-credential",
      "auth/user-not-found",
      "auth/wrong-password",
      "auth/invalid-login-credentials",
    ].includes(code)
  )
    return "We couldn’t sign you in. Check your email and password, or reset your password.";
  if (code === "auth/email-already-in-use")
    return "Unable to create this account. Try signing in or resetting your password.";
  if (code === "auth/invalid-email") return "Enter a valid email address.";
  if (
    code === "auth/weak-password" ||
    code === "auth/password-does-not-meet-requirements"
  )
    return "Choose a stronger password with at least 12 characters, including uppercase and lowercase letters and a number.";
  if (code === "auth/too-many-requests")
    return "Too many attempts. Please wait a few minutes before trying again.";
  if (code === "auth/network-request-failed" || code === "unavailable")
    return "We couldn’t reach the staff workspace. Check your connection and try again.";
  if (
    [
      "auth/operation-not-allowed",
      "auth/configuration-not-found",
      "auth/invalid-api-key",
    ].includes(code)
  )
    return "Staff sign-in is not available yet. Please contact the website administrator.";
  if (code === "auth/user-disabled")
    return "This account is unavailable. Please contact the website administrator.";
  if (code === "permission-denied")
    return "Access could not be confirmed. Ask the website administrator to check your staff permissions.";
  if (code === "failed-precondition")
    return "This part of the workspace is not ready yet. Please contact the website administrator.";
  return "Something went wrong. Please try again. Your changes have not been confirmed.";
}
