import { ArrowRightIcon } from "@/components/icons";
import { studyGuideSeriesOrder, type StudyGuide } from "@/data/study-guides";

type StudyGuideArchiveProps = {
  guides: StudyGuide[];
};

export function StudyGuideArchive({ guides }: StudyGuideArchiveProps) {
  const latest = guides[0];
  const series = studyGuideSeriesOrder.map((name) => ({
    name,
    guides: guides.filter((guide) => guide.series === name),
  }));

  return (
    <>
      <section className="study-guide-feature-shell">
        <div className="site-shell study-guide-feature">
          <div className="study-guide-feature__lead">
            <p className="eyebrow">Latest guide</p>
            <div className="study-guide-feature__number" aria-hidden="true">
              01
            </div>
            <div>
              <p className="study-guide-feature__date">{latest.dateLabel}</p>
              <h2>{latest.title}</h2>
              <p>
                Start with the newest conversation guide, then use the archive below to follow a series or revisit a Sunday.
              </p>
            </div>
            <a className="button button--gold" href={latest.href} target="_blank" rel="noreferrer">
              Open latest guide
              <ArrowRightIcon className="icon icon--xs" />
            </a>
          </div>

          <div className="study-guide-feature__aside">
            <p className="eyebrow">The archive at a glance</p>
            <div className="study-guide-feature__stats">
              <div>
                <strong>{guides.length}</strong>
                <span>guides</span>
              </div>
              <div>
                <strong>{series.filter((group) => group.guides.length > 0).length}</strong>
                <span>series</span>
              </div>
              <div>
                <strong>2026</strong>
                <span>current archive</span>
              </div>
            </div>
            <p className="study-guide-feature__aside-note">
              Every guide opens as a PDF from the shared Emmanuel Church archive.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell study-guide-archive-shell">
        <div className="site-shell">
          <div className="study-guide-archive__intro">
            <div>
              <p className="eyebrow">Find your week</p>
              <h2>A Thoughtful Way Back into the Message.</h2>
            </div>
            <p>
              Browse by series instead of scrolling through a file dump. Open a guide whenever you want to prepare, reflect, or continue the conversation with your group.
            </p>
          </div>

          <div className="study-guide-series-grid">
            {series.map((group, index) => (
              <details className="study-guide-series" key={group.name} open={index === 0}>
                <summary>
                  <span className="study-guide-series__index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="study-guide-series__name">{group.name}</span>
                  <span className="study-guide-series__count">{group.guides.length} guides</span>
                </summary>
                <div className="study-guide-series__body">
                  {group.guides.map((guide) => (
                    <a className="study-guide-item" key={guide.href} href={guide.href} target="_blank" rel="noreferrer">
                      <span className="study-guide-item__date">{guide.dateLabel}</span>
                      <span className="study-guide-item__title">{guide.title}</span>
                      <ArrowRightIcon className="icon icon--sm" />
                    </a>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
