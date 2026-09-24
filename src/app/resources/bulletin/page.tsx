import { DocumentArchiveReader } from "@/components/document-archive-reader";
import { ResourceTabs } from "@/components/resource-tabs";
import archives from "@/data/document-archives.json";
import "../document-archive.css";

export const metadata = {
  title: "Sunday Bulletins",
  description: "Read recent Sunday bulletins and browse the Emmanuel Church bulletin archive by month.",
};

export default function BulletinPage() {
  return (
    <>
      <ResourceTabs active="bulletin" includeHeading={false} />

      <DocumentArchiveReader kind="bulletins" issues={archives.bulletins} />

    </>
  );
}
