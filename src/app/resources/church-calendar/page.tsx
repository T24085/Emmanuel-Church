import { SectionHeading, SectionShell } from "@/components/section";
import { site } from "@/data/site";

export const metadata = {
  title: "Church Calendar",
  description: "Find upcoming gatherings, ministry events, and opportunities to connect at Emmanuel Church.",
};

export default function ChurchCalendarPage() {
  return (
    <SectionShell>
      <SectionHeading
        as="h1"
        eyebrow="Gather with us"
        title="Church Calendar"
        description="Find upcoming gatherings, ministry events, and opportunities to connect. If the calendar does not load, open it directly below."
        action={{ label: "Open calendar", href: site.calendarHref, external: true }}
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
