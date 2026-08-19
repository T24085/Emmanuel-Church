import { PageHero } from "@/components/page-hero";
import { ResourceTabs } from "@/components/resource-tabs";
import { SectionShell } from "@/components/section";
import { StudyGuideArchive } from "@/components/study-guide-archive";
import { studyGuides } from "@/data/study-guides";
import { site } from "@/data/site";

export default function WeeklySermonStudyGuidesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Weekly Sermon Study Guides"
        description="Continue the week's message with notes, discussion prompts, and downloadable study guides arranged as a living archive."
        action={{ label: "Open shared archive", href: site.studyGuideFolder, external: true }}
      />

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
