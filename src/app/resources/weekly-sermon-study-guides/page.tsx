import Link from "next/link";
import { ResourceTabs } from "@/components/resource-tabs";
import { DocumentArchiveReader } from "@/components/document-archive-reader";
import archives from "@/data/document-archives.json";
import "../resource-archives.css";
import "../document-archive.css";

export const metadata = {
  title: "Weekly Sermon Study Guides",
  description: "Take the Sunday message into your week with discussion questions and downloadable study guides from Emmanuel Church.",
};

export default function WeeklySermonStudyGuidesPage() {
  return (
    <>
      <ResourceTabs active="study-guides" includeHeading={false} />

      <DocumentArchiveReader kind="guides" issues={archives.guides} />

      <section className="resource-library-close">
        <div className="site-shell resource-library-close__inner">
          <div>
            <p className="eyebrow">Keep exploring</p>
            <h2>Pair the Guide with the Message.</h2>
            <p>Listen to the original sermon, then use the guide to carry the conversation into the week.</p>
          </div>
          <Link className="button button--gold" href="/resources/sermons">
            View sermons
          </Link>
        </div>
      </section>
    </>
  );
}
