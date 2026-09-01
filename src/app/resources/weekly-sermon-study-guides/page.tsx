import { ResourceTabs } from "@/components/resource-tabs";
import { SectionShell } from "@/components/section";
import { StudyGuideArchive } from "@/components/study-guide-archive";
import { studyGuides } from "@/data/study-guides";

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
          <a className="button button--gold" href="/resources/sermons">
            View sermons
          </a>
        </div>
      </SectionShell>
    </>
  );
}
