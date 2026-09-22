import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { serviceRhythm, site } from "@/data/site";
import { withBasePath } from "@/lib/site-path";

export const metadata = {
  title: "Plan Your Visit & Contact",
  description:
    "Plan a Sunday visit to Emmanuel Church in Abilene. Find service times, directions, and church office contact information.",
};

export default function ContactPage() {
  return (
    <>
      <section className="contact-visit-hero contact-motion" aria-labelledby="contact-visit-title">
        <div className="contact-visit-hero__copy">
          <p className="eyebrow">Plan your visit</p>
          <h1 id="contact-visit-title">We’d Love to Meet You.</h1>
          <p className="contact-visit-hero__intro">
            Come worship with us this Sunday in Abilene. There’s a place for you here, and we’d
            love to help you feel at home from the moment you arrive.
          </p>
          <div className="contact-visit-hero__actions">
            <a className="button button--gold" href={site.mapHref} target="_blank" rel="noreferrer">
              Get Directions <ArrowRightIcon className="icon icon--xs" />
            </a>
            <a className="contact-text-link" href={`mailto:${site.officeEmail}`}>
              Email the Office <ArrowRightIcon className="icon icon--xs" />
            </a>
          </div>
          <p className="contact-visit-hero__address">{site.address}</p>
        </div>
        <figure className="contact-visit-hero__photo">
          <Image
            src={withBasePath("/images/contact/welcome-center.jpg")}
            alt="A smiling volunteer beside Emmanuel Church’s Welcome Center desk"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 55vw"
            className="contact-visit-hero__image"
          />
        </figure>
      </section>

      <section className="contact-sunday contact-motion" aria-label="Sunday schedule">
        <div className="site-shell contact-sunday__inner">
          <p className="eyebrow">Sundays at Emmanuel</p>
          <div className="contact-sunday__times">
            {serviceRhythm.slice(0, 3).map((service) => (
              <div className="contact-sunday__time" key={service.label}>
                <strong>{service.value}</strong>
                <span>
                  {service.label === "First Service"
                    ? "Traditional worship"
                    : service.label === "Second Service"
                      ? "Contemporary worship"
                      : "Discipleship Hour"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-arrival" aria-labelledby="contact-arrival-title">
        <figure className="contact-arrival__photo contact-motion">
          <Image
            src={withBasePath("/images/contact/welcome-entry.jpg")}
            alt="People talking together at the entrance of Emmanuel Church"
            fill
            sizes="(max-width: 760px) 100vw, 52vw"
            className="contact-arrival__image"
          />
        </figure>
        <div className="contact-arrival__copy contact-motion">
          <p className="eyebrow">When you arrive</p>
          <h2 id="contact-arrival-title">A Warm Welcome Starts at the Door.</h2>
          <p>
            Whether this is your first Sunday or your first in a while, stop by the Welcome Center
            to ask a question, meet someone, and get oriented.
          </p>
          <p>
            Visiting with children? Emmanuel Kids has a place for them to learn and grow, too.
          </p>
          <Link className="contact-text-link" href="/connect/emmanuel-kids">
            Explore Emmanuel Kids <ArrowRightIcon className="icon icon--xs" />
          </Link>
        </div>
      </section>

      <section className="contact-find" aria-labelledby="contact-find-title">
        <div className="site-shell contact-find__inner">
          <div className="contact-find__details contact-motion">
            <p className="eyebrow">Find us / Get in touch</p>
            <h2 id="contact-find-title">We’re Here in Abilene.</h2>
            <address>{site.address}</address>
            <a className="contact-text-link" href={site.mapHref} target="_blank" rel="noreferrer">
              Open in Google Maps <ArrowRightIcon className="icon icon--xs" />
            </a>
            <div className="contact-find__methods">
              <div className="contact-find__method">
                <PhoneIcon className="icon icon--sm" />
                <div>
                  <span>Call the church office</span>
                  <a href={`tel:${site.phone.replace(/[^0-9+]/g, "")}`}>{site.phone}</a>
                </div>
              </div>
              <div className="contact-find__method">
                <MailIcon className="icon icon--sm" />
                <div>
                  <span>Send us a question</span>
                  <a href={`mailto:${site.officeEmail}`}>{site.officeEmail}</a>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-find__map">
            <iframe
              src={site.mapEmbedHref}
              title="Map showing Emmanuel Church in Abilene, Kansas"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a
              className="contact-find__map-link"
              href={site.mapHref}
              target="_blank"
              rel="noreferrer"
            >
              <span>Emmanuel Church · Abilene, Kansas</span>
              <strong>Get directions <ArrowRightIcon className="icon icon--xs" /></strong>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
