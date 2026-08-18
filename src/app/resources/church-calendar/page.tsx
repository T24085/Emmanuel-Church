import { SectionHeading, SectionShell } from "@/components/section";
import { site } from "@/data/site";

export default function ChurchCalendarPage() {
  return (
    <SectionShell>
      <SectionHeading
        eyebrow="Public calendar"
        title="Events and Happenings of the Church."
        description="This is the church's current public calendar destination."
      />
      <div className="calendar-embed">
        <iframe
          src={site.calendarHref}
          title="Emmanuel Church Calendar"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
    </SectionShell>
  );
}
