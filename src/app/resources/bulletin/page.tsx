import { BulletinArchive } from "@/components/bulletin-archive";
import { ResourceTabs } from "@/components/resource-tabs";
import { SectionHeading, SectionShell } from "@/components/section";
import { bulletins } from "@/data/bulletins";
import { site } from "@/data/site";

export default function BulletinPage() {
  return (
    <>
      <ResourceTabs active="bulletin" />

      <BulletinArchive bulletins={bulletins} />

      <SectionShell className="section-shell--tight">
        <div className="inline-banner">
          <div className="inline-banner__copy">
            <p className="eyebrow">Keep exploring</p>
            <h2>Need the shared folder?</h2>
            <p>Open Google Drive to see the complete bulletin archive and add future files as they become available.</p>
          </div>
          <a className="button button--gold" href={site.bulletinFolder} target="_blank" rel="noreferrer">
            Open Google Drive
          </a>
        </div>
      </SectionShell>
    </>
  );
}
