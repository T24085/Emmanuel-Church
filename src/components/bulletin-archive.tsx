import { ArrowRightIcon } from "@/components/icons";
import { bulletinMonthOrder, type Bulletin } from "@/data/bulletins";

type BulletinArchiveProps = {
  bulletins: Bulletin[];
};

function getPreviewHref(href: string) {
  return href.replace(/\/view(?:\?.*)?$/, "/preview");
}

export function BulletinArchive({ bulletins }: BulletinArchiveProps) {
  const latest = bulletins[0];
  const months = bulletinMonthOrder.map((name) => ({
    name,
    bulletins: bulletins.filter((bulletin) => bulletin.month === name),
  }));

  return (
    <>
      <section className="bulletin-feature-shell">
        <div className="site-shell bulletin-feature">
          <div className="bulletin-feature__lead">
            <p className="eyebrow">Latest bulletin</p>
            <div className="bulletin-feature__number" aria-hidden="true">
              01
            </div>
            <div>
              <p className="bulletin-feature__date">{latest.dateLabel}</p>
              <h2>Gather for Worship.</h2>
              <p>
                Open the most recent Sunday bulletin for announcements, service details, and the rhythm of life at Emmanuel Church.
              </p>
            </div>
            <a className="button button--gold" href={latest.href} target="_blank" rel="noreferrer">
              Read latest bulletin
              <ArrowRightIcon className="icon icon--xs" />
            </a>
          </div>

          <div className="bulletin-feature__aside">
            <p className="eyebrow">The archive at a glance</p>
            <div className="bulletin-feature__stats">
              <div>
                <strong>{bulletins.length}</strong>
                <span>bulletins</span>
              </div>
              <div>
                <strong>{months.filter((month) => month.bulletins.length > 0).length}</strong>
                <span>months</span>
              </div>
              <div>
                <strong>2026</strong>
                <span>current archive</span>
              </div>
            </div>
            <p className="bulletin-feature__aside-note">
              Each bulletin opens as a PDF from the shared Emmanuel Church archive.
            </p>
          </div>
        </div>
      </section>

      <section className="section-shell bulletin-archive-shell">
        <div className="site-shell">
          <div className="bulletin-archive__intro">
            <div>
              <p className="eyebrow">Find a Sunday</p>
              <h2>A Simple Way Back to the Life of the Church.</h2>
            </div>
            <p>
              Browse by month to find announcements, prayers, service details, and the small pieces that help a Sunday feel like home.
            </p>
          </div>

          <div className="bulletin-month-grid">
            {months.map((month, index) => (
              <details className="bulletin-month" key={month.name} open={index === 0}>
                <summary>
                  <span className="bulletin-month__index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="bulletin-month__name">{month.name}</span>
                  <span className="bulletin-month__count">{month.bulletins.length} Sundays</span>
                </summary>
                <div className="bulletin-month__body">
                  {month.bulletins.map((bulletin) => (
                    <details className="bulletin-item-preview" key={bulletin.href}>
                      <summary className="bulletin-item">
                        <span className="bulletin-item__date">{bulletin.dateLabel}</span>
                        <span className="bulletin-item__title">Sunday bulletin</span>
                        <span className="bulletin-item__action">
                          Preview
                          <ArrowRightIcon className="icon icon--sm" />
                        </span>
                      </summary>
                      <div className="bulletin-item__preview">
                        <iframe
                          title={`${bulletin.dateLabel} Sunday bulletin preview`}
                          src={getPreviewHref(bulletin.href)}
                          loading="lazy"
                        />
                        <a href={bulletin.href} target="_blank" rel="noreferrer">
                          Open full bulletin
                          <ArrowRightIcon className="icon icon--xs" />
                        </a>
                      </div>
                    </details>
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
