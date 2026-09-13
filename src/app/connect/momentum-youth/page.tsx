import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { SectionHeading, SectionShell } from "@/components/section";
import { site } from "@/data/site";
import { withBasePath } from "@/lib/site-path";
import extremeEncountersCabin from "../../../../Momentum Youth/extreme-encounters-cabin.jpg";
import extremeEncountersGroup from "../../../../Momentum Youth/extreme-encounters-group.jpeg";
import extremeEncountersReading from "../../../../Momentum Youth/extreme-encounters-reading.jpeg";
import extremeEncountersSunset from "../../../../Momentum Youth/extreme-encounters-sunset.png";

const momentumYouthCardImage = withBasePath("/images/ministry-cards/momentum-youth-card.png");

const shawnEmail = "shawn.ammons@sonlife.com";
const shawnCell = "316-650-0446";
const shawnCellHref = `tel:${shawnCell.replace(/[^0-9+]/g, "")}`;

const momentumValues = [
  {
    eyebrow: "Scripture",
    title: "Students are Grounded in Biblical Truth.",
    body: "Momentum keeps the Bible at the center so teens hear more than advice and more than hype.",
  },
  {
    eyebrow: "Community",
    title: "Meaningful Relationships are Part of the Ministry.",
    body: "Find a place to belong, build friendships, and grow alongside leaders who care about you.",
  },
  {
    eyebrow: "Discipleship",
    title: "The Goal is Invitation Into Real Growth.",
    body: "Take the next step in following Jesus and putting your faith into practice.",
  },
  {
    eyebrow: "Mission",
    title: "Students are Invited to Make a Difference.",
    body: "Learn how to serve others and share the love of Christ. Ask our team about getting involved.",
  },
];

const momentumCards = [
  {
    eyebrow: "More information",
    title: "New to Momentum?",
    body: "We would love to meet your family. Contact us with questions about joining the youth ministry.",
    action: {
      label: "Contact the office",
      href: "/contact",
    },
  },
  {
    eyebrow: "Extreme Kansas Camp",
    title: "Middle School Students Attend Camp at Milford Lake.",
    body: "Explore Extreme Kansas Camp and ask our team about the next opportunity to attend.",
    action: {
      label: "Open Extreme Encounters",
      href: "https://www.extremeencounters.org/",
      external: true,
    },
  },
  {
    eyebrow: "Stay up-to-date",
    title: "Use the Church Calendar for Current Events and Rhythms.",
    body: "If a family needs the broader schedule, the calendar is the best public source for church-wide dates.",
    action: {
      label: "View the calendar",
      href: "/resources/church-calendar",
    },
  },
  {
    eyebrow: "Volunteer team",
    title: "Training is Available for People Who Want to Serve.",
    body: "Contact the office about volunteer training and how you can support students in their faith.",
    action: {
      label: "Ask about training",
      href: "/contact",
    },
  },
];

const momentumGallery = [
  {
    src: extremeEncountersGroup,
    alt: "Extreme Encounters camp group photo",
    className: "momentum-gallery__item--wide",
  },
  {
    src: extremeEncountersReading,
    alt: "Students reading together under a tree at camp",
    className: "momentum-gallery__item--portrait",
  },
  {
    src: extremeEncountersCabin,
    alt: "Cabin building at Extreme Encounters",
    className: "momentum-gallery__item--landscape",
  },
  {
    src: extremeEncountersSunset,
    alt: "Students gathered at sunset during camp",
    className: "momentum-gallery__item--wide",
  },
];

export const metadata = {
  title: "Momentum Youth",
  description: "A place for middle and high school students to grow in faith and community at Emmanuel Church in Abilene.",
};

export default function MomentumYouthPage() {
  return (
    <>
      <PageHero
        eyebrow="Connect"
        title="A Student Ministry with Room for Faith to Move."
        description="Momentum Youth serves middle and high school students through teaching, community, and discipleship."
        mediaLayout="full"
        heroImage={{
          src: "/images/heroes/momentum-youth-gathering.jpg",
          alt: "Students gathered for teaching and community at Emmanuel Church",
          position: "center 46%",
        }}
        action={{ label: "Email Pastor Shawn", href: `mailto:${shawnEmail}`, external: true }}
        actionDetail={
          <div className="page-hero__countdown page-hero__countdown--contact">
            <div className="page-hero__countdown-photo">
              <Image
                src={withBasePath("/staff/Shawn-Ammons-Youth-Pastor.png")}
                alt="Pastor Shawn Ammons"
                fill
                sizes="56px"
                className="cover-image"
              />
            </div>
            <div className="page-hero__countdown-copy">
              <span className="page-hero__countdown-label">Momentum Youth</span>
              <strong>{shawnCell}</strong>
              <span>{shawnEmail}</span>
            </div>
          </div>
        }
      />

      <SectionShell>
        <SectionHeading
          eyebrow="Overview"
          title="Students Shaped by the Gospel, Not Just Entertained by Church."
          description="Momentum Youth is the church's primary student ministry, built to give teenagers biblical truth, meaningful relationships, and a clear invitation into discipleship."
        />

        <div className="split-grid">
          <article className="surface-card ministry-overview-card">
            <div className="surface-card__body content-copy momentum-overview__copy">
              <p>
                Momentum Youth gives middle and high school students a place to build friendships,
                ask questions, and grow as part of our church family.
              </p>
              <p>
                Want to make a difference in a student's life? Contact the office about volunteer
                training and the vision and values that guide Momentum.
              </p>
              <p>
                The ministry is designed to help students grow in Scripture, in community, and in purpose.
              </p>

              <div className="momentum-overview__actions">
                <a className="button button--gold button--small" href={`mailto:${shawnEmail}`}>
                  <MailIcon className="icon icon--xs" />
                  <span>Contact Pastor Shawn</span>
                </a>
                <a className="button button--light button--small" href={shawnCellHref}>
                  <PhoneIcon className="icon icon--xs" />
                  <span>Call {shawnCell}</span>
                </a>
              </div>
            </div>
            <figure className="ministry-overview-card__media ministry-overview-card__media--contain">
              <Image
                src={momentumYouthCardImage}
                alt="Momentum Youth ministry artwork"
                fill
                sizes="(max-width: 1080px) 100vw, 50vw"
                className="ministry-overview-card__image"
              />
            </figure>
          </article>

          <article className="surface-card momentum-feature-card">
            <div className="momentum-feature-card__inner">
              <p className="eyebrow eyebrow--small">What Momentum emphasizes</p>
              <div className="momentum-feature-card__rail">
                <span>Middle School</span>
                <span>High School</span>
                <span>Biblical Teaching</span>
                <span>Community</span>
                <span>Discipleship</span>
                <span>Mission</span>
              </div>
              <p>
                A student ministry designed to keep teenagers rooted in Scripture and connected to the church
                family around them.
              </p>
            </div>
          </article>
        </div>

        <div className="resource-grid momentum-values">
          {momentumValues.map((item) => (
            <article key={item.title} className="resource-card">
              <p className="eyebrow eyebrow--small">{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeading
          eyebrow="Camp & community"
          title="Scenes from Extreme Encounters."
          description="Friendships, time in Scripture, and shared adventures at camp."
        />

        <div className="momentum-gallery">
          {momentumGallery.map((image) => (
            <article key={image.alt} className={`surface-card momentum-gallery__item ${image.className}`}>
              <div className="momentum-gallery__media">
                <Image
                  src={withBasePath(image.src)}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1080px) 100vw, 50vw"
                  className="momentum-gallery__image"
                />
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeading
          eyebrow="Leadership"
          title="For More Information, Contact Pastor Shawn Ammons."
          description="Ask about joining Momentum, upcoming gatherings, or serving with the volunteer team."
        />

        <div className="resource-grid">
          <article className="resource-card momentum-contact-card">
            <p className="eyebrow eyebrow--small">Pastor</p>
            <h3>Shawn Ammons</h3>
            <p>Youth pastor for Momentum Youth.</p>
            <a className="resource-card__action" href={shawnCellHref}>
              <PhoneIcon className="icon icon--xs" />
              <span>Cell {shawnCell}</span>
            </a>
          </article>
          <article className="resource-card momentum-contact-card">
            <p className="eyebrow eyebrow--small">Email</p>
            <h3>shawn.ammons@sonlife.com</h3>
            <p>Questions about youth ministry? Reach out to Pastor Shawn.</p>
            <a className="resource-card__action" href={`mailto:${shawnEmail}`}>
              <MailIcon className="icon icon--xs" />
              <span>Email Shawn</span>
            </a>
          </article>
          <article className="resource-card momentum-contact-card">
            <p className="eyebrow eyebrow--small">Office</p>
            <h3>Emmanuel Church</h3>
            <p>{site.address}</p>
            <Link className="resource-card__action" href="/contact">
              <ArrowRightIcon className="icon icon--xs" />
              <span>Contact the office</span>
            </Link>
          </article>
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeading
          eyebrow="More information"
          title="Your Next Step with Momentum."
          description="Get in touch, explore camp, or find an upcoming church event."
        />

        <div className="resource-grid momentum-link-grid">
          {momentumCards.map((card) => (
            <article key={card.title} className="resource-card momentum-link-card">
              <p className="eyebrow eyebrow--small">{card.eyebrow}</p>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <Link
                className="resource-card__action"
                href={card.action.href}
                target={card.action.external ? "_blank" : undefined}
                rel={card.action.external ? "noreferrer" : undefined}
              >
                <ArrowRightIcon className="icon icon--xs" />
                <span>{card.action.label}</span>
              </Link>
            </article>
          ))}
        </div>
      </SectionShell>

      <a
        className="momentum-fab"
        href="https://www.extremeencounters.org/"
        target="_blank"
        rel="noreferrer"
        aria-label="Open Extreme Encounters"
      >
        <span>Extreme Encounters</span>
        <ArrowRightIcon className="icon icon--xs" />
      </a>
    </>
  );
}
