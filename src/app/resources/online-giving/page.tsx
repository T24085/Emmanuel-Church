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
            <div className="hero__actions giving-showcase__actions">
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

          <ol className="giving-foundation__list">
            {givingPrinciples.map((principle, index) => (
              <li className="giving-foundation__item" key={principle.id}>
                <span className="giving-foundation__marker" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="giving-foundation__body">
                  <p className="giving-foundation__principle">{principle.lens}</p>
                  <h3>{principle.title}</h3>
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
              </li>
            ))}
          </ol>
          <p className="giving-foundation__transition">
            Generosity begins with what God has already given.
          </p>
        </section>
      </SectionShell>
    </>
  );
}
