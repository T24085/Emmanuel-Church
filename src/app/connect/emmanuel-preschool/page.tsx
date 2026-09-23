import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { site } from "@/data/site";
import { withBasePath } from "@/lib/site-path";
import { PreschoolEnrollmentPrompt } from "./preschool-enrollment-prompt";
import "./preschool-redesign.css";

const enrollmentFormUrl =
  "https://emmanuel.fellowshiponego.com/external/form/79f34db5-a551-42f4-a93a-17019fe114b7";
const preschoolEmail = "preschool@ecabilene.org";
const preschoolPhoneHref = `tel:${site.phone.replace(/[^0-9+]/g, "")}`;

const preschoolGalleryPhotos = [
  {
    src: "/images/emmanuel-preschool/gallery/nursery-play.jpg",
    alt: "A teacher plays with young children in the preschool nursery.",
    position: "center 45%",
  },
  {
    src: "/images/emmanuel-preschool/gallery/snack-table.jpg",
    alt: "Children enjoying a snack together at a preschool table.",
    position: "center 45%",
  },
  {
    src: "/images/emmanuel-preschool/gallery/classroom-table.jpg",
    alt: "Children gathered around a classroom table during a preschool activity.",
    position: "center 48%",
  },
  {
    src: "/images/emmanuel-preschool/gallery/one-on-one-activity.jpg",
    alt: "A teacher works closely with a child during a classroom activity.",
    position: "center 43%",
  },
  {
    src: "/images/emmanuel-preschool/gallery/mentor-reading.jpg",
    alt: "A teacher and child share a quiet learning moment together.",
    position: "center 44%",
  },
  {
    src: "/images/emmanuel-preschool/gallery/kids-writing-wall.jpg",
    alt: "Children add drawings and words to a colorful classroom wall.",
    position: "center 45%",
  },
  {
    src: "/images/emmanuel-preschool/gallery/snack-portrait.jpg",
    alt: "Two preschool children enjoy snack time together.",
    position: "center 43%",
  },
  {
    src: "/images/emmanuel-preschool/gallery/kids-art-wall.jpg",
    alt: "Children work together on a creative classroom display.",
    position: "center 44%",
  },
  {
    src: "/images/emmanuel-preschool/gallery/nursery-room.jpg",
    alt: "A teacher and young children play together in the nursery room.",
    position: "center 48%",
  },
  {
    src: "/images/emmanuel-preschool/gallery/teacher-planning.jpg",
    alt: "Teachers prepare a preschool classroom activity together.",
    position: "center 42%",
  },
  {
    src: "/images/emmanuel-preschool/gallery/art-class-close.jpg",
    alt: "Preschool children and teachers gather around a hands-on art activity.",
    position: "center 48%",
  },
];

const programPillars = [
  {
    number: "01",
    eyebrow: "Faith",
    title: "Jesus is part of the everyday rhythm.",
    body: "Old and New Testament stories help children know one God, meet Jesus as His Son, and understand that Jesus came to be our rescuer.",
  },
  {
    number: "02",
    eyebrow: "Learning",
    title: "Kindergarten readiness grows through play.",
    body: "Structured learning, creativity, imagination, movement, and free play build the academic and social-emotional skills children need next.",
  },
  {
    number: "03",
    eyebrow: "Care",
    title: "Small classes make room for every child.",
    body: "A ten-child maximum and KDHE-licensed environment keep safety, relationships, and individual development at the center of the day.",
  },
];

const classOptions = ["2-Day Program", "3-Day Program", "5-Day Program"];

const enrollmentPolicies = [
  {
    eyebrow: "Readiness",
    title: "Age and Classroom Readiness",
    body: "Every child must be at least 3 years old before attending and must be potty-trained before starting.",
    open: true,
  },
  {
    eyebrow: "Health records",
    title: "Forms, Exams, and Immunizations",
    body: "Each child must have a medical examination within six months of school starting and updated immunization records signed and on file.",
  },
  {
    eyebrow: "Fees and class size",
    title: "Current Fees and Availability",
    body: "Class size is limited to ten children. Contact the preschool office for current tuition, enrollment fees, and waiting-list availability.",
  },
  {
    eyebrow: "Open to all",
    title: "Every Family is Welcome",
    body: "The preschool is open to all children regardless of race, color, creed, religion, national origin, ancestry, physical handicap, or sex.",
  },
  {
    eyebrow: "Program policies",
    title: "Program Expectations",
    body: "The preschool reserves the right to dismiss a child if they are consistently incompatible with other children or if monthly tuition is not paid on time.",
  },
];

const preschoolTeam = [
  {
    eyebrow: "Director",
    name: "Rachel Bishop",
    role: "Preschool director and Kids pastor.",
    image: "/staff/Rachel-Bishop-Kid-s-Pastor-Preschool-Director.png",
    alt: "Rachel Bishop, Emmanuel Preschool director",
  },
  {
    eyebrow: "Teacher",
    name: "Marie Malo",
    role: "Preschool teacher and classroom support.",
    image: "/staff/Marie-Malo-Preschool-Teacher.jpeg",
    alt: "Marie Malo, Emmanuel Preschool teacher",
  },
];

export const metadata = {
  title: "Emmanuel Preschool",
  description:
    "Christ-centered early learning for ages 3–5 in Abilene. Explore Emmanuel Preschool and contact our team about current enrollment.",
};

export default function EmmanuelPreschoolPage() {
  return (
    <div className="preschool-page">
      <PreschoolEnrollmentPrompt enrollmentHref={enrollmentFormUrl} />

      <section id="preschool-hero" className="preschool-hero preschool-reveal" aria-labelledby="preschool-title">
        <div className="preschool-hero__media" aria-hidden="true">
          <Image
            src={withBasePath("/images/heroes/preschool-creative-learning.jpg")}
            alt=""
            fill
            priority
            sizes="100vw"
            className="preschool-hero__image"
          />
        </div>
        <div className="preschool-hero__wash" />

        <div className="site-shell preschool-hero__inner">
          <div className="preschool-hero__copy">
            <p className="preschool-kicker">Emmanuel Preschool <span aria-hidden="true">·</span> Ages 3–5</p>
            <h1 id="preschool-title">Where Faith and First Steps Grow Together.</h1>
            <p className="preschool-hero__intro">
              A Christ-centered preschool where children learn, play, build friendships, and gain a joyful
              foundation for kindergarten.
            </p>
            <div className="preschool-hero__actions" aria-label="Preschool enrollment actions">
              <a className="preschool-button preschool-button--gold" href={enrollmentFormUrl} target="_blank" rel="noreferrer">
                <span>Begin Enrollment</span>
                <ArrowRightIcon className="icon icon--sm" />
              </a>
              <a className="preschool-button preschool-button--ghost" href={preschoolPhoneHref}>
                <PhoneIcon className="icon icon--sm" />
                <span>Talk With Rachel</span>
              </a>
            </div>
          </div>

          <div className="preschool-hero__status" aria-label="Enrollment status">
            <span className="preschool-hero__status-dot" aria-hidden="true" />
            <div>
              <span>Now enrolling</span>
              <strong>Contact us for current openings</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="preschool-intro" aria-labelledby="preschool-intro-title">
        <div className="site-shell preschool-intro__layout">
          <div className="preschool-intro__heading preschool-reveal">
            <p className="preschool-kicker">A joyful beginning</p>
            <h2 id="preschool-intro-title">A Small School With a Whole-Child View.</h2>
          </div>
          <div className="preschool-intro__copy preschool-reveal">
            <p className="preschool-intro__lede">
              Emmanuel Preschool is a ministry of Emmanuel Church, created to give young learners a firm
              foundation in faith, relationships, and early academics.
            </p>
            <p>
              Each day balances individual attention and group discovery—circle time, small groups, snack,
              music and movement, recreation, creativity, and plenty of room to play.
            </p>
            <a className="preschool-text-link" href={`mailto:${preschoolEmail}`}>
              <MailIcon className="icon icon--xs" />
              <span>Ask about current openings</span>
              <ArrowRightIcon className="icon icon--xs" />
            </a>
          </div>
        </div>

        <div className="preschool-facts" aria-label="Preschool facts">
          <div className="site-shell preschool-facts__grid">
            <div className="preschool-fact preschool-reveal"><span>01</span><strong>Ages 3–5</strong><p>Early-learning classrooms</p></div>
            <div className="preschool-fact preschool-reveal"><span>02</span><strong>KDHE Licensed</strong><p>Standards-minded care</p></div>
            <div className="preschool-fact preschool-reveal"><span>03</span><strong>10 Children</strong><p>Maximum class size</p></div>
            <div className="preschool-fact preschool-reveal"><span>04</span><strong>2, 3, or 5 Days</strong><p>Flexible program choices</p></div>
          </div>
        </div>
      </section>

      <section className="preschool-gallery-section" aria-labelledby="preschool-gallery-title">
        <div className="site-shell preschool-gallery__lead preschool-reveal">
          <p className="preschool-kicker">Inside the classroom</p>
          <h2 id="preschool-gallery-title">Learning Looks Like Wonder, Friendship, and Play.</h2>
        </div>
        <div className="preschool-gallery" aria-label="Emmanuel Preschool classroom gallery">
          {preschoolGalleryPhotos.map((photo, index) => (
            <figure className="preschool-gallery__item preschool-reveal" key={photo.src}>
              <Image
                src={withBasePath(photo.src)}
                alt={photo.alt}
                fill
                sizes={index === 10 ? "100vw" : "(max-width: 700px) 100vw, (max-width: 1080px) 50vw, 33vw"}
                className="preschool-gallery__image"
                style={{ objectPosition: photo.position }}
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="preschool-pillars" aria-labelledby="preschool-pillars-title">
        <div className="site-shell">
          <div className="preschool-pillars__heading preschool-reveal">
            <p className="preschool-kicker preschool-kicker--light">The heart of the program</p>
            <h2 id="preschool-pillars-title">Faith, Learning, and Care Shape Every Day.</h2>
            <p>Three priorities, held together in one thoughtful classroom rhythm.</p>
          </div>
          <div className="preschool-pillars__list">
            {programPillars.map((pillar) => (
              <article className="preschool-pillar preschool-reveal" key={pillar.number}>
                <span className="preschool-pillar__number" aria-hidden="true">{pillar.number}</span>
                <p className="preschool-kicker preschool-kicker--light">{pillar.eyebrow}</p>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="preschool-classes" aria-labelledby="preschool-classes-title">
        <div className="site-shell preschool-classes__layout">
          <div className="preschool-classes__heading preschool-reveal">
            <p className="preschool-kicker">Class options</p>
            <h2 id="preschool-classes-title">Choose the Rhythm That Fits Your Family.</h2>
            <p>Schedules, tuition, fees, and openings can change. Our preschool team will help you find the current option that fits.</p>
          </div>
          <div className="preschool-classes__list">
            {classOptions.map((option, index) => (
              <article className="preschool-class preschool-reveal" key={option}>
                <span className="preschool-class__index">0{index + 1}</span>
                <h3>{option}</h3>
                <p>Contact us for the current schedule and tuition.</p>
                <a href={`mailto:${preschoolEmail}?subject=${encodeURIComponent(`${option} availability`)}`}>
                  Check availability <ArrowRightIcon className="icon icon--xs" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="preschool-admissions" aria-labelledby="preschool-admissions-title">
        <div className="site-shell preschool-admissions__layout">
          <div className="preschool-admissions__heading preschool-reveal">
            <p className="preschool-kicker">Before you enroll</p>
            <h2 id="preschool-admissions-title">The Important Details, Kept Simple.</h2>
            <p>Review the essentials here, then contact our team for current forms, costs, and availability.</p>
          </div>
          <div className="preschool-admissions__list">
            {enrollmentPolicies.map((policy, index) => (
              <details className="preschool-policy preschool-reveal" key={policy.title} open={policy.open}>
                <summary>
                  <span className="preschool-policy__number">0{index + 1}</span>
                  <span className="preschool-policy__label">
                    <span>{policy.eyebrow}</span>
                    <strong>{policy.title}</strong>
                  </span>
                  <span className="preschool-policy__toggle" aria-hidden="true" />
                </summary>
                <p>{policy.body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="preschool-enrollment" className="preschool-contact" aria-labelledby="preschool-contact-title">
        <div className="site-shell preschool-contact__layout">
          <div className="preschool-contact__copy preschool-reveal">
            <p className="preschool-kicker preschool-kicker--light">Your next step</p>
            <h2 id="preschool-contact-title">Come Meet the People Who Will Know Your Child by Name.</h2>
            <p>
              Rachel Bishop directs Emmanuel Preschool, and Marie Malo supports children and families in the
              classroom. They would love to answer your questions and help with enrollment.
            </p>
            <div className="preschool-contact__actions">
              <a className="preschool-button preschool-button--gold" href={enrollmentFormUrl} target="_blank" rel="noreferrer">
                <span>Begin Enrollment</span>
                <ArrowRightIcon className="icon icon--sm" />
              </a>
              <a className="preschool-button preschool-button--ghost" href={`mailto:${preschoolEmail}`}>
                <MailIcon className="icon icon--sm" />
                <span>Email the Preschool</span>
              </a>
            </div>
            <div className="preschool-contact__details">
              <a href={preschoolPhoneHref}><PhoneIcon className="icon icon--xs" />{site.phone}</a>
              <a href={`mailto:${preschoolEmail}`}><MailIcon className="icon icon--xs" />{preschoolEmail}</a>
              <Link href="/contact">{site.address}<ArrowRightIcon className="icon icon--xs" /></Link>
            </div>
          </div>

          <div className="preschool-team" aria-label="Preschool team">
            {preschoolTeam.map((person) => (
              <figure className="preschool-team__person preschool-reveal" key={person.name}>
                <div className="preschool-team__photo">
                  <Image
                    src={withBasePath(person.image)}
                    alt={person.alt}
                    fill
                    sizes="(max-width: 700px) 50vw, 24vw"
                    className="preschool-team__image"
                  />
                </div>
                <figcaption>
                  <span>{person.eyebrow}</span>
                  <strong>{person.name}</strong>
                  <p>{person.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
