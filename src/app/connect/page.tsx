import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { ministryLinks } from "@/data/site";
import { withBasePath } from "@/lib/site-path";
import { MinistryMotion } from "./ministry-motion";
import "./ministries.css";

const childMinistries = [
  {
    href: "/connect/emmanuel-preschool",
    image: "/images/heroes/preschool-creative-learning.jpg",
    alt: "Young children working on a creative activity with church volunteers",
    position: "center 48%",
    action: "Explore Emmanuel Preschool",
  },
  {
    href: "/connect/emmanuel-kids",
    image: "/images/heroes/emmanuel-kids-welcome.jpg",
    alt: "A child smiling and waving at an Emmanuel Kids gathering",
    position: "center 45%",
    action: "Explore Emmanuel Kids",
  },
  {
    href: "/connect/momentum-youth",
    image: "/images/heroes/momentum-youth-gathering.jpg",
    alt: "Students gathered for Momentum Youth",
    position: "center 58%",
    action: "Explore Momentum Youth",
  },
] as const;

const communityMinistries = [
  {
    href: "/connect/adult-discipleship-groups",
    image: "/images/heroes/adult-discipleship-study.jpg",
    alt: "Adults studying together around a table at Emmanuel Church",
    position: "center 53%",
    action: "Explore Adult Discipleship Groups",
  },
  {
    href: "/connect/wednesday-night-blast",
    image: "/images/heroes/blast-outdoor-game.jpg",
    alt: "Children and leaders playing an outdoor game at Emmanuel Church",
    position: "center 55%",
    action: "Explore Wednesday Night B.L.A.S.T.",
  },
] as const;

function getMinistry(href: string) {
  const ministry = ministryLinks.find((item) => item.href === href);
  if (!ministry) throw new Error(`Missing ministry link for ${href}`);
  return ministry;
}

export const metadata = {
  title: "Ministries",
  description: "Find your place at Emmanuel Church through ministries for children, students, adults, and families.",
};

export default function ConnectPage() {
  const worship = getMinistry("/connect/worship-arts-ministry");

  return (
    <div className="ministries-page">
      <MinistryMotion />

      <section className="ministries-hero" aria-labelledby="ministries-title">
        <div className="ministries-hero__copy ministry-reveal">
          <p className="eyebrow">Ministries at Emmanuel</p>
          <h1 id="ministries-title">Find Your Place at Emmanuel.</h1>
          <p className="ministries-hero__intro">
            From preschool through adult discipleship, there is a place to belong, grow in faith,
            and serve together.
          </p>
          <nav className="ministries-hero__jumps" aria-label="Explore ministries">
            <a href="#children-students">Children &amp; Students</a>
            <a href="#grow-together">Grow Together</a>
            <a href="#worship-serve">Worship &amp; Serve</a>
          </nav>
        </div>
        <figure className="ministries-hero__photo">
          <Image
            src={withBasePath("/images/heroes/connect-arrival.jpg")}
            alt="A family arriving at Emmanuel Church"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 55vw"
            className="ministries-hero__image"
          />
        </figure>
      </section>

      <section className="ministries-chapter ministries-children" id="children-students" aria-labelledby="children-students-title">
        <div className="ministries-shell">
          <header className="ministries-chapter__heading ministry-reveal">
            <p className="eyebrow">Children &amp; Students</p>
            <h2 id="children-students-title">Room to Grow from the Very Beginning.</h2>
            <p>Places for children and students to learn, build friendships, and grow in faith.</p>
          </header>
          <div className="ministries-children__grid">
            {childMinistries.map((photo) => {
              const ministry = getMinistry(photo.href);
              return (
                <article className="ministries-photo-card ministry-reveal" key={photo.href}>
                  <div className="ministries-photo-card__media">
                    <Image
                      src={withBasePath(photo.image)}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 760px) 100vw, (max-width: 1020px) 50vw, 33vw"
                      style={{ objectPosition: photo.position }}
                    />
                  </div>
                  <div className="ministries-photo-card__copy">
                    <h3>{ministry.label}</h3>
                    <p>{ministry.description}</p>
                    <Link className="ministries-link" href={ministry.href}>
                      {photo.action} <ArrowRightIcon className="icon icon--xs" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ministries-chapter ministries-community" id="grow-together" aria-labelledby="grow-together-title">
        <div className="ministries-shell">
          <header className="ministries-chapter__heading ministry-reveal">
            <p className="eyebrow">Grow Together</p>
            <h2 id="grow-together-title">Faith Is Lived in Community.</h2>
            <p>Make room for shared study, prayer, and the life of the church during the week.</p>
          </header>
          <div className="ministries-community__grid">
            {communityMinistries.map((photo) => {
              const ministry = getMinistry(photo.href);
              return (
                <article className="ministries-community-card ministry-reveal" key={photo.href}>
                  <div className="ministries-community-card__media">
                    <Image
                      src={withBasePath(photo.image)}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 760px) 100vw, 50vw"
                      style={{ objectPosition: photo.position }}
                    />
                  </div>
                  <div className="ministries-community-card__copy">
                    <h3>{ministry.label}</h3>
                    <p>{ministry.description}</p>
                    <Link className="ministries-link" href={ministry.href}>
                      {photo.action} <ArrowRightIcon className="icon icon--xs" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ministries-worship" id="worship-serve" aria-labelledby="worship-serve-title">
        <div className="ministries-worship__media">
          <Image
            src={withBasePath("/images/worship-arts/worship-team.jpg")}
            alt="Musicians leading worship at Emmanuel Church"
            fill
            sizes="(max-width: 760px) 100vw, 58vw"
            style={{ objectPosition: "center 48%" }}
          />
        </div>
        <div className="ministries-worship__copy ministry-reveal">
          <p className="eyebrow">Worship &amp; Serve</p>
          <h2 id="worship-serve-title">Bring Your Gifts to the Gathering.</h2>
          <h3>{worship.label}</h3>
          <p>{worship.description}</p>
          <Link className="ministries-link ministries-link--light" href={worship.href}>
            Explore Worship Arts Ministry <ArrowRightIcon className="icon icon--xs" />
          </Link>
        </div>
      </section>

      <section className="ministries-next" aria-labelledby="ministries-next-title">
        <div className="ministries-shell ministries-next__inner ministry-reveal">
          <div>
            <p className="eyebrow">Your next step</p>
            <h2 id="ministries-next-title">Not Sure Where to Start?</h2>
            <p>We would be glad to help you find a place to connect.</p>
          </div>
          <div className="ministries-next__actions">
            <Link className="button button--gold" href="/contact">Plan Your Visit</Link>
            <Link className="ministries-link" href="/contact">
              Contact the Church <ArrowRightIcon className="icon icon--xs" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
