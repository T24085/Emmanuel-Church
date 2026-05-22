import { PageHero } from "@/components/page-hero";
import { SectionHeading, SectionShell } from "@/components/section";
import { site } from "@/data/site";

export default function ChurchCalendarPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Church Calendar"
        description="View Emmanuel Church events and gatherings in the public Fellowship One Go calendar."
        action={{ label: "Open the live site", href: site.calendarHref, external: true }}
      />

      <SectionShell>
        <SectionHeading
          eyebrow="Public calendar"
          title="Events and Happenings of the Church."
          description="This is the public calendar destination used by the church."
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
    </>
  );
}
