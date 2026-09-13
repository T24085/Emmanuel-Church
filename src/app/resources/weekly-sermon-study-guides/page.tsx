import Link from "next/link";
import { ResourceTabs } from "@/components/resource-tabs";
import { SectionShell } from "@/components/section";
import { StudyGuideArchive } from "@/components/study-guide-archive";
import { studyGuides } from "@/data/study-guides";

export const metadata = {
  title: "Weekly Sermon Study Guides",
  description: "Take the Sunday message into your week with discussion questions and downloadable study guides from Emmanuel Church.",
};

export default function WeeklySermonStudyGuidesPage() {
  return (
    <>
      <ResourceTabs active="study-guides" />

      <StudyGuideArchive guides={studyGuides} />

      <SectionShell className="section-shell--tight">
        <div className="inline-banner">
          <div className="inline-banner__copy">
            <p className="eyebrow">Keep exploring</p>
            <h2>Pair the Guide with the Message.</h2>
            <p>Listen to the original sermon, then use the guide to carry the conversation into the week.</p>
          </div>
          <Link className="button button--gold" href="/resources/sermons">
            View sermons
          </Link>
        </div>
      </SectionShell>
    </>
  );
}
