import { ArrowRightIcon } from "@/components/icons";
import { bulletins } from "@/data/bulletins";
import { studyGuides } from "@/data/study-guides";

function getPreviewHref(href: string) {
  return href.replace(/\/view(?:\?.*)?$/, "/preview");
}

export function ResourceHighlights() {
  const latestBulletin = bulletins[0];
  const latestGuide = studyGuides[0];

  return (
    <section className="resource-highlights-shell">
      <div className="site-shell">
        <div className="resource-highlights__intro">
          <div>
            <p className="eyebrow">Latest resources</p>
            <h2>Stay Close to the Life of Emmanuel.</h2>
          </div>
          <p>Start with this week's bulletin or carry Sunday's message into the week with a study guide.</p>
        </div>

        <div className="resource-highlights-grid">
          <article className="resource-highlight resource-highlight--bulletin">
            <div className="resource-highlight__preview">
              <iframe
                title={`${latestBulletin.dateLabel} Sunday bulletin preview`}
                src={getPreviewHref(latestBulletin.href)}
                loading="lazy"
              />
            </div>
            <div className="resource-highlight__body">
              <p className="eyebrow eyebrow--small">Latest bulletin</p>
              <p className="resource-highlight__date">{latestBulletin.dateLabel}</p>
              <h3>Gather for Worship.</h3>
              <p>Announcements, service details, and the rhythm of the church in one Sunday bulletin.</p>
              <a className="button button--gold" href={latestBulletin.href} target="_blank" rel="noreferrer">
                Read latest bulletin
                <ArrowRightIcon className="icon icon--xs" />
              </a>
            </div>
          </article>

          <article className="resource-highlight resource-highlight--guide">
            <div className="resource-highlight__body">
              <p className="eyebrow eyebrow--small">Latest study guide</p>
              <p className="resource-highlight__date">{latestGuide.dateLabel}</p>
              <h3>{latestGuide.title}</h3>
              <p>
                Continue the conversation with questions, Scripture, and a simple way to keep growing together during the week.
              </p>
              <a className="resource-highlight__link" href={latestGuide.href} target="_blank" rel="noreferrer">
                Open latest guide
                <ArrowRightIcon className="icon icon--xs" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
