import { BulletinArchive } from "@/components/bulletin-archive";
import { ResourceTabs } from "@/components/resource-tabs";
import { SectionHeading, SectionShell } from "@/components/section";
import { bulletins } from "@/data/bulletins";
import { site } from "@/data/site";

export const metadata = {
  title: "Sunday Bulletins",
  description: "Read recent Sunday bulletins and browse the Emmanuel Church bulletin archive by month.",
};

export default function BulletinPage() {
  return (
    <>
      <ResourceTabs active="bulletin" />

      <BulletinArchive bulletins={bulletins} />

      <SectionShell className="section-shell--tight">
        <div className="inline-banner">
          <div className="inline-banner__copy">
            <p className="eyebrow">Keep exploring</p>
            <h2>Looking for an Earlier Bulletin?</h2>
            <p>Browse the church's shared Google Drive folder for more Sunday bulletins.</p>
          </div>
          <a className="button button--gold" href={site.bulletinFolder} target="_blank" rel="noreferrer">
            Open Google Drive
          </a>
        </div>
      </SectionShell>
    </>
  );
}
