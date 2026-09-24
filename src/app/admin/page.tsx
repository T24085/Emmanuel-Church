import type { Metadata } from "next";
import { StaffPortal } from "./staff-portal";
import "./staff-portal.css";

export const metadata: Metadata = {
  title: "Staff Workspace",
  description:
    "The private staff workspace for Emmanuel Church resources, communications, and website requests.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <StaffPortal />;
}
