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
    <div className="resource-library resource-library--guides">
      <section className="resource-library__feature-shell" aria-labelledby="study-guide-feature-title">
        <div className="site-shell resource-library__feature">
          <div className="resource-library__feature-copy">
            <p className="resource-library__kicker">This week’s study guide</p>
            <p className="resource-library__date"><time dateTime={latest.date}>{latest.dateLabel}</time></p>
            <h2 id="study-guide-feature-title">{latest.title}</h2>
            <p className="resource-library__summary">
              Carry Sunday’s message into conversation, reflection, and prayer throughout the week.
            </p>
            <a className="resource-library__primary-action" href={latest.href} target="_blank" rel="noreferrer">
              Open this study guide
              <ArrowRightIcon className="icon icon--xs" />
            </a>

            <dl className="resource-library__stats" aria-label="Study guide archive summary">
              <div><dt>Guides</dt><dd>{guides.length}</dd></div>
              <div><dt>Series</dt><dd>{series.filter((group) => group.guides.length > 0).length}</dd></div>
              <div><dt>Archive</dt><dd>2026</dd></div>
            </dl>
          </div>

          <div className="resource-library__preview resource-library__preview--guide-cover">
            <div className="resource-library__preview-label">
              <span>{latest.series}</span>
              <strong>{latest.dateLabel}</strong>
            </div>
            <div className="resource-library__guide-cover" aria-label={`${latest.title} study guide cover`}>
              <div className="resource-library__guide-cover-brand">
                <span>Emmanuel Church</span>
                <span>Weekly Study</span>
              </div>
              <span className="resource-library__guide-cover-number" aria-hidden="true">01</span>
              <div>
                <p>{latest.series}</p>
                <h3>{latest.title}</h3>
              </div>
              <time dateTime={latest.date}>{latest.dateLabel}</time>
            </div>
            <a href={latest.href} target="_blank" rel="noreferrer">
              View full size <ArrowRightIcon className="icon icon--xs" />
            </a>
          </div>
        </div>
      </section>

      <section className="resource-library__archive" aria-labelledby="study-guide-archive-title">
        <div className="site-shell">
          <div className="resource-library__intro">
            <div>
              <p className="resource-library__kicker">Continue the conversation</p>
              <h2 id="study-guide-archive-title">Explore Guides by Sermon Series.</h2>
            </div>
            <p>
              Choose a series, revisit a Sunday, and use the guide on your own or with a group. Every guide opens as a PDF.
            </p>
          </div>

          <div className="resource-library__groups">
            {series.map((group, index) => (
              <details className="resource-library__group" key={group.name} open={index === 0}>
                <summary>
                  <span className="resource-library__group-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="resource-library__group-name">{group.name}</span>
                  <span className="resource-library__group-count">
                    {group.guides.length} {group.guides.length === 1 ? "Guide" : "Guides"}
                  </span>
                  <span className="resource-library__group-toggle" aria-hidden="true" />
                </summary>
                <div className="resource-library__documents resource-library__documents--guides">
                  {group.guides.map((guide) => (
                    <a
                      className="resource-document resource-document--guide"
                      key={guide.href}
                      href={guide.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <time dateTime={guide.date} className="resource-document__date">{guide.dateLabel}</time>
                      <span className="resource-document__copy">
                        <span className="resource-document__type">{guide.series}</span>
                        <strong>{guide.title}</strong>
                      </span>
                      <span className="resource-document__action">
                        Open guide <ArrowRightIcon className="icon icon--xs" />
                      </span>
                    </a>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
