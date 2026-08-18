import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/icons";
import { SectionHeading, SectionShell } from "@/components/section";
import { givingPrinciples } from "@/data/giving";
import { site } from "@/data/site";
import { withBasePath } from "@/lib/site-path";

export default function OnlineGivingPage() {
  return (
    <>
      <a
        className="giving-fab"
        href={site.givingHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Open the donation page"
      >
        <span>Donate Now</span>
        <ArrowRightIcon className="icon icon--xs" />
      </a>

      <SectionShell>
        <SectionHeading
          eyebrow="Giving"
          title="A Clear Way to Give."
          description="Fellowship One Giving is Emmanuel's current online portal. Give once, manage your account, and choose whether to cover processing fees."
        />
        <div className="giving-showcase">
          <figure className="giving-showcase__media">
            <Image
              src={withBasePath("/images/giving/giving-jesus.png")}
              alt="Jesus giving bread to a child"
              fill
              sizes="(max-width: 1080px) 100vw, 58vw"
              className="cover-image"
              priority
            />
          </figure>

          <aside className="giving-showcase__copy">
            <p className="eyebrow">Online giving</p>
            <h3>Generosity is Part of Discipleship.</h3>
            <p>
              Use Fellowship One Giving for one-time gifts, recurring support, and account
              access in one place.
            </p>
            <div className="hero__actions">
              <a className="button button--gold" href={site.givingHref} target="_blank" rel="noreferrer">
                Give now
              </a>
              <Link className="button button--light" href="/contact">
                <span>Need help?</span>
              </Link>
            </div>
          </aside>
        </div>
        <section className="giving-foundation" aria-labelledby="giving-foundation-title">
          <div className="giving-foundation__heading">
            <p className="eyebrow">Why we give</p>
            <h2 id="giving-foundation-title">Generosity is Worship in Motion.</h2>
            <p>
              We do not give because God needs something from us. We give because God is
              accomplishing something through us and within us. As we faithfully steward all He
              has entrusted to us, our worship deepens, our hearts are transformed, and His
              Kingdom advances.
            </p>
          </div>

          <div className="giving-foundation__list">
            {givingPrinciples.map((principle) => (
              <details className="giving-foundation__item" key={principle.id}>
                <summary>
                  <span className="giving-foundation__summary-copy">
                    <span className="giving-foundation__principle">{principle.lens}</span>
                    <span className="giving-foundation__title">{principle.title}</span>
                  </span>
                  <span className="giving-foundation__summary-hint">Read the foundation</span>
                </summary>
                <div className="giving-foundation__content">
                  <div className="giving-foundation__body">
                    <p>{principle.summary}</p>
                  </div>
                  <div className="giving-foundation__scriptures" aria-label={`${principle.title} scripture`}>
                    <p className="eyebrow eyebrow--small">Scripture · KJV</p>
                    {principle.scriptures.map((scripture) => (
                      <blockquote key={scripture.reference}>
                        <p>“{scripture.text}”</p>
                        <cite>{scripture.reference}</cite>
                      </blockquote>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>
        <div className="resource-grid">
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">Donation portal</p>
            <h3>Fellowship One Giving</h3>
            <p>The church's current online giving portal.</p>
            <a className="resource-card__action" href={site.givingHref} target="_blank" rel="noreferrer">
              <ArrowRightIcon className="icon icon--xs" />
              <span>Make a donation</span>
            </a>
          </article>
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">Support</p>
            <h3>Need Help?</h3>
            <p>Reach the office for login help, receipts, or support from the right staff member.</p>
            <Link className="resource-card__action" href="/contact">
              <ArrowRightIcon className="icon icon--xs" />
              <span>Contact us</span>
            </Link>
          </article>
        </div>
      </SectionShell>
    </>
  );
}
