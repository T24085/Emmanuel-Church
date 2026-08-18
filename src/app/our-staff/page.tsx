import { SectionHeading, SectionShell } from "@/components/section";
import { StaffGrid } from "@/components/staff-grid";

export default function OurStaffPage() {
  return (
    <div className="our-staff-page">
      <SectionShell>
        <SectionHeading
          eyebrow="Directory"
          title="Meet the People Serving Emmanuel Church."
          description="Browse the staff directory by portrait, name, and role to find the right person quickly."
        />
        <StaffGrid />
      </SectionShell>
    </div>
  );
}
