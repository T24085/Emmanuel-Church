import { ArrowRightIcon } from "@/components/icons";
import { bulletinMonthOrder, type Bulletin } from "@/data/bulletins";

type BulletinArchiveProps = {
  bulletins: Bulletin[];
};

function getPreviewHref(href: string) {
  return href.replace(/\/view(?:\?.*)?$/, "/preview");
}

function getDateParts(date: string) {
  const [year, month, day] = date.split("-");
  const monthLabel = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(
    new Date(`${year}-${month}-01T00:00:00Z`),
  );

  return { year, month: monthLabel, day: String(Number(day)) };
}

export function BulletinArchive({ bulletins }: BulletinArchiveProps) {
  const latest = bulletins[0];
  const months = bulletinMonthOrder.map((name) => ({
    name,
    bulletins: bulletins.filter((bulletin) => bulletin.month === name),
  }));

  return (
    <div className="resource-library resource-library--bulletins">
      <section className="resource-library__feature-shell" aria-labelledby="bulletin-feature-title">
        <div className="site-shell resource-library__feature">
          <div className="resource-library__feature-copy">
            <p className="resource-library__kicker">Latest Sunday bulletin</p>
            <p className="resource-library__date"><time dateTime={latest.date}>{latest.dateLabel}</time></p>
            <h2 id="bulletin-feature-title">Everything You Need for Sunday, in One Place.</h2>
            <p className="resource-library__summary">
              Follow the order of worship, read church announcements, and keep the week ahead close at hand.
            </p>
            <a className="resource-library__primary-action" href={latest.href} target="_blank" rel="noreferrer">
              Open this bulletin
              <ArrowRightIcon className="icon icon--xs" />
            </a>

            <dl className="resource-library__stats" aria-label="Bulletin archive summary">
              <div><dt>Bulletins</dt><dd>{bulletins.length}</dd></div>
              <div><dt>Months</dt><dd>{months.filter((month) => month.bulletins.length > 0).length}</dd></div>
              <div><dt>Archive</dt><dd>2026</dd></div>
            </dl>
          </div>

          <div className="resource-library__preview">
            <div className="resource-library__preview-label">
              <span>Sunday edition</span>
              <strong>{latest.dateLabel}</strong>
            </div>
            <iframe
              title={`${latest.dateLabel} Sunday bulletin preview`}
              src={getPreviewHref(latest.href)}
              loading="eager"
            />
            <a href={latest.href} target="_blank" rel="noreferrer">
              View full size <ArrowRightIcon className="icon icon--xs" />
            </a>
          </div>
        </div>
      </section>

      <section className="resource-library__archive" aria-labelledby="bulletin-archive-title">
        <div className="site-shell">
          <div className="resource-library__intro">
            <div>
              <p className="resource-library__kicker">The Sunday archive</p>
              <h2 id="bulletin-archive-title">Find the Week You’re Looking For.</h2>
            </div>
            <p>
              Browse by month, then open any bulletin directly. Each document is kept in Emmanuel Church’s shared archive.
            </p>
          </div>

          <div className="resource-library__groups">
            {months.map((month, index) => (
              <details className="resource-library__group" key={month.name} open={index === 0}>
                <summary>
                  <span className="resource-library__group-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="resource-library__group-name">{month.name}</span>
                  <span className="resource-library__group-count">
                    {month.bulletins.length} {month.bulletins.length === 1 ? "Sunday" : "Sundays"}
                  </span>
                  <span className="resource-library__group-toggle" aria-hidden="true" />
                </summary>
                <div className="resource-library__documents">
                  {month.bulletins.map((bulletin) => {
                    const date = getDateParts(bulletin.date);

                    return (
                      <a
                        className="resource-document resource-document--bulletin"
                        key={bulletin.href}
                        href={bulletin.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <time dateTime={bulletin.date} className="resource-document__date-block">
                          <span>{date.month}</span>
                          <strong>{date.day}</strong>
                          <span>{date.year}</span>
                        </time>
                        <span className="resource-document__copy">
                          <span className="resource-document__type">Sunday bulletin</span>
                          <strong>{bulletin.dateLabel}</strong>
                        </span>
                        <span className="resource-document__action">
                          Open PDF <ArrowRightIcon className="icon icon--xs" />
                        </span>
                      </a>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
