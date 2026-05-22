import Link from "next/link";
import { ArrowRightIcon, MailIcon, LocationIcon, PhoneIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { SectionHeading, SectionShell } from "@/components/section";
import { contactEmails, externalLinks, site } from "@/data/site";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Start here if you're new."
        description="Use this page for the address, phone number, map, emails, and the public links the church currently shares."
        action={{ label: "Locate us", href: site.mapHref, external: true }}
      />

      <SectionShell>
        <SectionHeading
          eyebrow="Visit"
          title="1300 N. Vine Street, Abilene, KS 67410"
          description="This is the public address listed throughout the site."
        />

        <div className="resource-grid">
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">Phone</p>
            <h3>{site.phone}</h3>
            <p>Call the church office for guest information and general questions.</p>
            <a className="resource-card__action" href={`tel:${site.phone.replace(/[^0-9+]/g, "")}`}>
              <PhoneIcon className="icon icon--xs" />
              <span>Call now</span>
            </a>
          </article>
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">Map</p>
            <h3>Locate us</h3>
            <p>Open the official Google Maps listing for Emmanuel Church.</p>
            <a className="resource-card__action" href={site.mapHref} target="_blank" rel="noreferrer">
              <LocationIcon className="icon icon--xs" />
              <span>Open map</span>
            </a>
          </article>
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">Email</p>
            <h3>Staff inboxes</h3>
            <p>Direct contact addresses from the public staff and preschool pages.</p>
            <Link className="resource-card__action" href={`mailto:${contactEmails[0]}`}>
              <MailIcon className="icon icon--xs" />
              <span>Email the office</span>
            </Link>
          </article>
        </div>

        <div className="contact-map surface-card">
          <div className="surface-card__body contact-map__copy">
            <p className="eyebrow eyebrow--small">Map view</p>
            <h3>Find the church on the map.</h3>
            <p>Use the embedded map to preview the location, plan a route, or open the full listing.</p>
            <a className="surface-card__link" href={site.mapHref} target="_blank" rel="noreferrer">
              <span>Open map in Google Maps</span>
              <ArrowRightIcon className="icon icon--xs" />
            </a>
          </div>
          <div className="contact-map__media sermon-player__media">
            <iframe
              src={site.mapEmbedHref}
              title="Emmanuel Church map view"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        <div style={{ marginTop: "1rem" }} className="link-list">
          {externalLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="link-list__item"
            >
              <div>
                <h3 style={{ margin: 0 }}>{item.label}</h3>
                <p>{item.note}</p>
              </div>
              <ArrowRightIcon className="icon icon--sm" />
            </a>
          ))}
        </div>
      </SectionShell>
    </>
  );
}
