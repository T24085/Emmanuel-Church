import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { SectionHeading, SectionShell } from "@/components/section";
import { site } from "@/data/site";
import { withBasePath } from "@/lib/site-path";
import preschoolLogo from "../../../../Emmanuel Preschool/c3b52863-0605-4eab-bad9-07d9bf181c66.png";

const preschoolCardImage = withBasePath("/images/ministry-cards/emmanuel-preschool-card.png");

const preschoolGalleryPhotos = [
  {
    src: withBasePath("/images/emmanuel-preschool/gallery/art-class-wide.jpg"),
    alt: "Preschool children and teachers creating together around a bright classroom table.",
  },
  {
    src: withBasePath("/images/emmanuel-preschool/gallery/nursery-play.jpg"),
    alt: "A teacher plays with young children in the preschool nursery.",
  },
  {
    src: withBasePath("/images/emmanuel-preschool/gallery/snack-table.jpg"),
    alt: "Children enjoying a snack together at a preschool table.",
  },
  {
    src: withBasePath("/images/emmanuel-preschool/gallery/classroom-table.jpg"),
    alt: "Children gathered around a classroom table during a preschool activity.",
  },
  {
    src: withBasePath("/images/emmanuel-preschool/gallery/one-on-one-activity.jpg"),
    alt: "A teacher works closely with a child during a classroom activity.",
  },
  {
    src: withBasePath("/images/emmanuel-preschool/gallery/mentor-reading.jpg"),
    alt: "A teacher and child share a quiet learning moment together.",
  },
  {
    src: withBasePath("/images/emmanuel-preschool/gallery/kids-writing-wall.jpg"),
    alt: "Children add drawings and words to a colorful classroom wall.",
  },
  {
    src: withBasePath("/images/emmanuel-preschool/gallery/snack-portrait.jpg"),
    alt: "Two preschool children enjoy snack time together.",
  },
  {
    src: withBasePath("/images/emmanuel-preschool/gallery/kids-art-wall.jpg"),
    alt: "Children work together on a creative classroom display.",
  },
  {
    src: withBasePath("/images/emmanuel-preschool/gallery/nursery-room.jpg"),
    alt: "A teacher and young children play together in the nursery room.",
  },
  {
    src: withBasePath("/images/emmanuel-preschool/gallery/teacher-planning.jpg"),
    alt: "Teachers prepare a preschool classroom activity together.",
  },
  {
    src: withBasePath("/images/emmanuel-preschool/gallery/art-class-close.jpg"),
    alt: "Preschool children and teachers gather around a hands-on art activity.",
  },
];

const preschoolEmail = "preschool@ecabilene.org";

const preschoolTeam = [
  {
    eyebrow: "Director",
    name: "Rachel Bishop",
    role: "Preschool director and Kids pastor.",
    image: "/staff/Rachel-Bishop-Kid-s-Pastor-Preschool-Director.png",
    alt: "Rachel Bishop, Emmanuel Preschool director",
    href: `tel:${site.phone.replace(/[^0-9+]/g, "")}`,
    label: site.phone,
    kind: "phone",
  },
  {
    eyebrow: "Teacher",
    name: "Marie Malo",
    role: "Preschool teacher and classroom support.",
    image: "/staff/Marie-Malo-Preschool-Teacher.jpeg",
    alt: "Marie Malo, Emmanuel Preschool teacher",
    href: `mailto:${preschoolEmail}`,
    label: preschoolEmail,
    kind: "email",
  },
];

const classOptions = [
  {
    eyebrow: "2 day class",
    title: "Tuesday / Thursday AM",
    detail: "8:00-11:00 AM",
    price: "$80/month",
  },
  {
    eyebrow: "3 day class",
    title: "Monday / Wednesday / Friday AM",
    detail: "8:00-11:00 AM",
    price: "$100/month",
  },
  {
    eyebrow: "5 day class",
    title: "Monday-Friday AM",
    detail: "12:00-3:00 PM",
    price: "$150/month",
  },
];

const missionCards = [
  {
    eyebrow: "Christ-centered",
    title: "Bible Themes Woven Into the Classroom.",
    body: "The preschool includes topics from the Old and New Testament, with emphasis on one God, Jesus as His son, and Jesus sent as our rescuer.",
  },
  {
    eyebrow: "Whole-child growth",
    title: "Academic and Social/Emotional Skills Matter Together.",
    body: "The program gives children the foundation they need for kindergarten while helping them grow in confidence, communication, and relationships.",
  },
  {
    eyebrow: "Licensed care",
    title: "KDHE Licensed and Standards-Minded.",
    body: "Emmanuel Preschool adheres to the standards set by Kansas licensing and keeps safety, structure, and development at the center of the day.",
  },
];

const policyCards = [
  {
    eyebrow: "Open to all",
    title: "Families from Every Background are Welcome.",
    body: "The preschool is open to all children regardless of race, color, creed, religion, national origin, ancestry, physical handicap, or sex.",
  },
  {
    eyebrow: "Readiness",
    title: "Children Must be 3 and Potty-Trained.",
    body: "Every child must be at least 3 years old prior to attendance and must be potty-trained before starting.",
  },
  {
    eyebrow: "Health records",
    title: "Forms, Exam, and Immunizations are Required.",
    body: "Each child must have a medical examination within 6 months of school starting and updated immunization records signed and on file.",
  },
  {
    eyebrow: "Enrollment fee",
    title: "$25 Nonrefundable Fee Holds the Spot.",
    body: "Applications are accepted once the required forms are received. Class size is limited to 10 children per class, and other applications are placed on a waiting list.",
  },
  {
    eyebrow: "Program rules",
    title: "Dismissal Policy Follows the Live Site Copy.",
    body: "The preschool reserves the right to dismiss a child if they are consistently incompatible with other children or if monthly tuition is not paid on time.",
  },
];

export const metadata = {
  title: "Emmanuel Preschool",
  description: "Christ-centered early learning for ages 3–5 in Abilene. Explore classes and contact Emmanuel Preschool about enrollment.",
};

export default function EmmanuelPreschoolPage() {
  return (
    <>
      <a
        className="preschool-floating-form button button--gold"
        href="https://emmanuel.fellowshiponego.com/external/form/79f34db5-a551-42f4-a93a-17019fe114b7"
        target="_blank"
        rel="noreferrer"
      >
        <span>Enrollment Form</span>
        <ArrowRightIcon className="icon icon--sm" />
      </a>

      <PageHero
        eyebrow="Connect"
        title="A Joyful Start. A Foundation in Faith."
        description="Emmanuel Preschool serves children ages 3-5 with early learning, spiritual formation, and the daily rhythms that prepare them for kindergarten."
        mediaLayout="full"
        heroImage={{
          src: "/images/heroes/preschool-creative-learning.jpg",
          alt: "Preschool children creating together with Emmanuel Church leaders",
          position: "center 52%",
        }}
        action={{ label: "Email the preschool", href: `mailto:${preschoolEmail}` }}
        actionDetail={
          <div className="page-hero__countdown page-hero__countdown--contact">
            <div className="page-hero__countdown-photo">
              <Image
                src={withBasePath("/staff/Rachel-Bishop-Kid-s-Pastor-Preschool-Director.png")}
                alt="Rachel Bishop"
                fill
                sizes="56px"
                className="cover-image"
              />
            </div>
            <div className="page-hero__countdown-copy">
              <span className="page-hero__countdown-label">2025-2026</span>
              <strong>Enrollment has begun</strong>
              <span>Contact Rachel Bishop or Marie Malo at (785) 263-3342.</span>
            </div>
          </div>
        }
      />

      <SectionShell>
        <SectionHeading
          eyebrow="Overview"
          title="A Christ-Centered Start for Young Learners."
          description="Emmanuel's Preschool is a ministry of Emmanuel Church whose goal is to provide a Christ-centered and academic setting for children ages 3-5 and give them a firm foundation for kindergarten."
        />

        <div className="split-grid">
          <article className="surface-card ministry-overview-card">
            <div className="surface-card__body content-copy preschool-overview__copy">
              <p>
                Emmanuel's Preschool includes topics from the Old and New Testament, with an emphasis on the
                truth that we have one God, that Jesus is His son, and that Jesus was sent to be our rescuer.
              </p>
              <p>
                The program also places equal importance on giving each child the academic and social/emotional
                skills needed to help them be successful in kindergarten.
              </p>
              <p>
                Ask the preschool office about class availability. Our team can help with forms,
                questions, and next steps.
              </p>

              <div className="preschool-overview__actions">
                <a className="button button--gold button--small" href={`mailto:${preschoolEmail}`}>
                  <MailIcon className="icon icon--xs" />
                  <span>Email preschool</span>
                </a>
                <Link className="button button--light button--small" href="/our-staff">
                  <span>View staff</span>
                  <ArrowRightIcon className="icon icon--xs" />
                </Link>
              </div>
            </div>
            <figure className="ministry-overview-card__media ministry-overview-card__media--contain">
              <Image
                src={preschoolCardImage}
                alt="Emmanuel Preschool ministry artwork"
                fill
                sizes="(max-width: 1080px) 100vw, 50vw"
                className="ministry-overview-card__image"
              />
            </figure>
          </article>

          <article className="surface-card preschool-hero-card">
            <div className="preschool-hero-card__media">
              <Image
                src={preschoolLogo}
                alt="Emmanuel Preschool logo collage"
                fill
                priority
                sizes="(max-width: 1080px) 100vw, 48vw"
                className="preschool-hero-card__image"
              />
              <div className="preschool-hero-card__overlay">
                <p className="eyebrow eyebrow--small">Classroom life</p>
                <strong>Faith, learning, and play in one rhythm.</strong>
              </div>
            </div>
          </article>
        </div>

        <div className="resource-grid preschool-facts">
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">Ages</p>
            <h3>3-5 Years Old</h3>
            <p>The preschool is built for children who are ready for an early-learning classroom experience.</p>
          </article>
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">License</p>
            <h3>KDHE Licensed</h3>
            <p>The school follows the standards set by Kansas licensing.</p>
          </article>
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">Class size</p>
            <h3>10 Children Maximum</h3>
            <p>Applications beyond the limit are placed on a waiting list.</p>
          </article>
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">Daily rhythm</p>
            <h3>Structured and Playful</h3>
            <p>Circle time, small groups, snack, music and movement, and recreation shape the day.</p>
          </article>
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeading
          eyebrow="Gallery"
          title="A Glimpse Into the Preschool Classroom."
          description="A look at the learning, play, and creativity that fill our classrooms."
        />

        <div className="preschool-gallery">
          <div className="preschool-gallery__grid">
            {preschoolGalleryPhotos.map((photo) => (
              <figure
                className="surface-card preschool-gallery__item"
                key={photo.src}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1080px) 50vw, 25vw"
                  className="preschool-gallery__image"
                />
              </figure>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeading
          eyebrow="Mission & services"
          title="The Preschool Day is Built Around Learning, Formation, and Safety."
          description="All classes are taught in a way that encourages individual and group activities, structured learning, free play, creativity, imagination, social development, and safety."
        />

        <div className="resource-grid">
          {missionCards.map((card) => (
            <article key={card.title} className="resource-card">
              <p className="eyebrow eyebrow--small">{card.eyebrow}</p>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeading
          eyebrow="Classes"
          title="Find a Class for Your Child."
          description="Explore our morning classes below. Please confirm class availability, tuition, and enrollment fees with the preschool office."
        />

        <div className="resource-grid preschool-class-options">
          {classOptions.map((option) => (
            <article key={option.eyebrow} className="resource-card preschool-class-card">
              <p className="eyebrow eyebrow--small">{option.eyebrow}</p>
              <h3>{option.title}</h3>
              <p>{option.detail}</p>
              <strong className="preschool-class-card__price">{option.price}</strong>
            </article>
          ))}
          <article className="resource-card preschool-class-card">
            <p className="eyebrow eyebrow--small">Enrollment fee</p>
            <h3>$25 Nonrefundable</h3>
            <p>The fee holds your child's spot once the required paperwork has been received.</p>
            <strong className="preschool-class-card__price">Waiting list applies after 10 students</strong>
          </article>
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeading
          eyebrow="Admissions"
          title="Before You Enroll."
          description="Review the enrollment requirements, then contact our team with any questions."
        />

        <div className="resource-grid">
          {policyCards.map((card) => (
            <article key={card.title} className="resource-card">
              <p className="eyebrow eyebrow--small">{card.eyebrow}</p>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeading
          eyebrow="Contact"
          title="For More Information, Contact the Preschool Office."
          description="Rachel Bishop directs the preschool, and Marie Malo serves as the preschool teacher."
        />

        <div className="resource-grid preschool-contact-grid">
          {preschoolTeam.map((person) => (
            <article className="resource-card preschool-contact-card" key={person.name}>
              <div className="preschool-contact-card__photo">
                <Image
                  src={withBasePath(person.image)}
                  alt={person.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1080px) 50vw, 33vw"
                  className="preschool-contact-card__image"
                />
              </div>
              <div className="preschool-contact-card__body">
                <p className="eyebrow eyebrow--small">{person.eyebrow}</p>
                <h3>{person.name}</h3>
                <p>{person.role}</p>
                <a className="resource-card__action" href={person.href}>
                  {person.kind === "phone" ? <PhoneIcon className="icon icon--xs" /> : <MailIcon className="icon icon--xs" />}
                  <span>{person.label}</span>
                </a>
              </div>
            </article>
          ))}
          <article className="resource-card preschool-office-card">
            <p className="eyebrow eyebrow--small">Office</p>
            <h3>Emmanuel Church</h3>
            <p>{site.address}</p>
            <Link className="resource-card__action" href="/contact">
              <ArrowRightIcon className="icon icon--xs" />
              <span>View contact page</span>
            </Link>
          </article>
        </div>
      </SectionShell>
    </>
  );
}
