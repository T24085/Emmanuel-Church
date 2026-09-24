import { EmmanuelMotif } from "./emmanuel-motif";
import { withBasePath } from "@/lib/site-path";

export function ArchiveCover({
  kind,
  count,
}: {
  kind: "bulletins" | "guides";
  count: number;
}) {
  return (
    <div className="archive-cover">
      <img
        className="archive-cover__logo"
        src={withBasePath("/images/emmanuel-church-logo.png")}
        alt="Emmanuel Church"
        width="240"
        height="90"
      />
      <div className="archive-cover__rule" />
      <p className="archive-cover__eyebrow">The Emmanuel collection</p>
      <h2>
        {kind === "bulletins" ? (
          <>
            Sunday
            <br />
            Bulletins
          </>
        ) : (
          <>
            Weekly
            <br />
            Study Guides
          </>
        )}
      </h2>
      <p className="archive-cover__subtitle">
        {kind === "bulletins"
          ? "The life of our church, week by week."
          : "The Word, carried into your week."}
      </p>
      <EmmanuelMotif className="archive-cover__motif" />
      <div className="archive-cover__foot">
        <span>Faith. Life. Together.</span>
        <span>{count} editions</span>
      </div>
    </div>
  );
}
