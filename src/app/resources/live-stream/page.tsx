import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SectionHeading, SectionShell } from "@/components/section";
import { ArrowRightIcon } from "@/components/icons";
import { site } from "@/data/site";

export const metadata = {
  title: "Watch Live",
  description: "Join Emmanuel Church online for worship, or explore recordings of past messages.",
};

export default function LiveStreamPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Live Stream"
        description="Watch Emmanuel Church live through the online.church platform."
        action={{ label: "Open live stream", href: site.onlineChurch, external: true }}
      />

      <SectionShell>
        <SectionHeading
          eyebrow="Watch"
          title="Worship Wherever You Are."
          description="Join a service online, catch up on a message you missed, or follow along in the Bible."
        />

        <div className="resource-grid">
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">Live</p>
            <h3>Online Church Platform</h3>
            <p>The current destination for Sunday services.</p>
            <a
              className="resource-card__action"
              href={site.onlineChurch}
              target="_blank"
              rel="noreferrer"
            >
              <ArrowRightIcon className="icon icon--xs" />
              <span>Open platform</span>
            </a>
          </article>
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">Archive</p>
            <h3>Sermons</h3>
            <p>Past messages are available from the sermons page.</p>
            <Link className="resource-card__action" href="/resources/sermons">
              <ArrowRightIcon className="icon icon--xs" />
              <span>View sermons</span>
            </Link>
          </article>
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">Bible app</p>
            <h3>YouVersion Events</h3>
            <p>The church also points worshipers to the Bible app for sermon notes.</p>
            <a className="resource-card__action" href={site.bibleApp} target="_blank" rel="noreferrer">
              <ArrowRightIcon className="icon icon--xs" />
              <span>Open Bible.com</span>
            </a>
          </article>
        </div>
      </SectionShell>
    </>
  );
}
