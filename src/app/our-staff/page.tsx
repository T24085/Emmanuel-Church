import { SectionHeading, SectionShell } from "@/components/section";
import { StaffGrid } from "@/components/staff-grid";

export const metadata = {
  title: "Our Staff",
  description: "Meet the pastors, ministry leaders, and staff serving Emmanuel Church in Abilene, Kansas.",
};

export default function OurStaffPage() {
  return (
    <div className="our-staff-page">
      <SectionShell>
        <SectionHeading
          as="h1"
          eyebrow="Directory"
          title="Meet the People Serving Emmanuel Church."
          description="Meet our pastors, ministry leaders, and staff. Reach out with a question or let us help you find your place at Emmanuel."
        />
        <StaffGrid />
      </SectionShell>
    </div>
  );
}
