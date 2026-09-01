import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { SectionHeading, SectionShell } from "@/components/section";
import { site } from "@/data/site";
import kidsLogo from "../../../../Emmanuel Preschool/Emmanuel Kids/58ce1398-acdc-4270-912f-46a1ab136586.png";

const rachelPhoneHref = `tel:${site.phone.replace(/[^0-9+]/g, "")}`;
const rachelEmail = "rbishop@ecabilene.org";
const kidsVisitorFormUrl =
  "https://emmanuel.fellowshiponego.com/external/form/b242e76b-ecfd-41ed-90c1-d08a8411027a";

const sundaySchedule = [
  {
    title: "8:45 AM Service",
    rooms: [
      "Nursery: 6 weeks-2 years old, Room 102",
      "Pre-K Children's Church: 3-5 years, Room 103",
      "Elementary Children's Church: K-4th grade, Room 104",
    ],
  },
  {
    title: "10:00 AM Discipleship Class",
    rooms: [
      "Nursery: 6 weeks-1 year, Room 102",
      "Toddlers and Pre-K: 2-4 years, Room 101",
      "Elementary: Room 104, then split into K-1st (Room 107), 2nd (Room 104), 3rd (Room 105), 4th (Room 214), and 5th (Pastor Rachel's Office)",
    ],
  },
  {
    title: "11:00 AM Service",
    rooms: [
      "Nursery: 6 weeks-2 years old, Room 102",
      "Pre-K Children's Church: 3-5 years, Room 103",
      "Elementary Children's Church: K-4th grade, Room 104",
    ],
  },
];

const blastSchedule = [
  "Wednesday Night B.L.A.S.T. runs September through November and January through April.",
  "Classes meet from 6:30-7:30 pm for nursery, pre-K, and elementary kids.",
  "Children experience music and worship, interactive lessons, games, crafts, and small-group time.",
  "All children may be picked up in the Emmanuel Kids Wing.",
];

const highlights = [
  {
    eyebrow: "Love",
    title: "Kids Experience the Love of Christ in a Warm, Welcoming Setting.",
    body: "Children are known, helped, and encouraged by leaders who care about their growth and joy.",
  },
  {
    eyebrow: "Grace",
    title: "Grace Shows up in How Children are Welcomed and Taught.",
    body: "The ministry is designed to help kids learn in age-appropriate ways while feeling safe and seen.",
  },
  {
    eyebrow: "Worship",
    title: "Worship is Part of the Rhythm, Not a Side Activity.",
    body: "Singing, Bible teaching, and shared prayer all shape the kids ministry experience.",
  },
  {
    eyebrow: "Truth",
    title: "Children Hear Clear Biblical Truth in a Form They Can Understand.",
    body: "The ministry aims to help kids experience God with teaching that is simple, faithful, and memorable.",
  },
];

const firstTimeSteps = [
  {
    title: "Fill Out the Visitor Form",
    body: "If this is your first time visiting, complete the Emmanuel Kids Visitor Form so check-in is quick and smooth.",
  },
  {
    title: "Check in at the Wing",
    body: "All children may be picked up in the Emmanuel Kids Wing after their scheduled programming ends.",
  },
  {
    title: "Ask Questions Anytime",
    body: "Rachel Bishop can help with Sunday rhythms, Wednesday nights, or any questions about your child’s age group.",
  },
];

export default function EmmanuelKidsPage() {
  return (
    <>
      <PageHero
        eyebrow="Connect"
        title="Where Kids Experience the Love, Grace, Worship, and Truth of Jesus Christ."
        description="Emmanuel Kids is the church's children's ministry for nursery through elementary age, built to keep families connected and children rooted in the gospel."
        mediaLayout="full"
        heroImage={{
          src: "/images/heroes/emmanuel-kids-welcome.jpg",
          alt: "A child smiling during Emmanuel Church Vacation Bible School",
          position: "center 45%",
        }}
        action={{ label: "Plan a family visit", href: "/contact" }}
        actionDetail={
          <div className="page-hero__countdown">
            <span className="page-hero__countdown-label">Kids ministry</span>
            <strong>Sunday mornings and Wednesday nights</strong>
            <span>Children's Pastor and Preschool Director: Rachel Bishop.</span>
          </div>
        }
      />

      <SectionShell>
        <SectionHeading
          eyebrow="Overview"
          title="A Children's Ministry Built Around Worship, Learning, and Belonging."
          description="Emmanuel Kids helps children know Jesus, grow in community, and feel seen by the church family around them."
        />

        <div className="split-grid">
          <article className="surface-card ministry-overview-card">
            <div className="surface-card__body content-copy kids-overview__copy">
              <p>
                Emmanuel Kids is intentionally woven into the Sunday schedule and the broader family rhythms of
                Emmanuel Church.
              </p>
              <p>
                The ministry covers nursery, pre-K, and elementary age groups, and the programming is organized
                so families know exactly where to go.
              </p>
              <p>
                From Sunday morning worship to midweek B.L.A.S.T., the goal is the same: help children grow in a
                way that is joyful, safe, and gospel-focused.
              </p>

              <div className="kids-overview__actions">
                <a className="button button--gold button--small" href={`mailto:${rachelEmail}`}>
                  <MailIcon className="icon icon--xs" />
                  <span>Email Rachel Bishop</span>
                </a>
                <a className="button button--light button--small" href={rachelPhoneHref}>
                  <PhoneIcon className="icon icon--xs" />
                  <span>Call the church office</span>
                </a>
              </div>
            </div>
            <figure className="ministry-overview-card__media ministry-overview-card__media--contain">
              <Image
                src={kidsLogo}
                alt="Emmanuel Kids ministry artwork"
                fill
                sizes="(max-width: 1080px) 100vw, 50vw"
                className="ministry-overview-card__image"
              />
            </figure>
          </article>

          <article className="surface-card kids-logo-card">
            <div className="kids-logo-card__media">
              <Image
                src={kidsLogo}
                alt="Emmanuel Kids logo"
                fill
                priority
                sizes="(max-width: 1080px) 100vw, 48vw"
                className="kids-logo-card__image"
              />
            </div>
          </article>
        </div>

        <div className="resource-grid kids-highlights">
          {highlights.map((item) => (
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
          eyebrow="New here?"
          title="The Visitor Form Helps the Check-In Process Move Quickly."
          description="If you are visiting for the first time, the church asks families to fill out a short form before arrival."
        />

        <div className="resource-grid">
          {firstTimeSteps.map((step, index) => (
            <article key={step.title} className="resource-card">
              <p className="eyebrow eyebrow--small">Step {index + 1}</p>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">Visitor form</p>
            <h3>Emmanuel Kids Visitor Form</h3>
            <p>This puts your family into the church management system so check-in is quick for your child.</p>
            <a
              className="resource-card__action"
              href={kidsVisitorFormUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ArrowRightIcon className="icon icon--xs" />
              <span>Open visitor form</span>
            </a>
          </article>
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeading
          eyebrow="Sunday Morning"
          title="Kids Ministry During Each Part of the Sunday Rhythm."
          description="These are the current service and discipleship-hour groupings from the public Emmanuel Kids page."
        />

        <div className="resource-grid">
          {sundaySchedule.map((block) => (
            <article key={block.title} className="resource-card kids-schedule-card">
              <p className="eyebrow eyebrow--small">{block.title}</p>
              <h3>Room Assignments by Age Group</h3>
              <div className="kids-schedule-card__list">
                {block.rooms.map((room) => (
                  <p key={room}>{room}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeading
          eyebrow="Wednesday Night"
          title='B.L.A.S.T. Gives Kids a Strong Midweek Anchor.'
          description="The ministry runs on a seasonal schedule and brings children together for teaching, music, games, and small groups."
        />

        <div className="split-grid">
          <article className="surface-card">
            <div className="surface-card__body content-copy kids-blast__copy">
              {blastSchedule.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </article>

          <div className="resource-grid">
            <article className="resource-card">
              <p className="eyebrow eyebrow--small">Nursery</p>
              <h3>Room 102</h3>
              <p>Ages 6 weeks to 2 years.</p>
            </article>
            <article className="resource-card">
              <p className="eyebrow eyebrow--small">Pre-K</p>
              <h3>Rooms 101 and 103</h3>
              <p>Ages 3-5 years.</p>
            </article>
            <article className="resource-card">
              <p className="eyebrow eyebrow--small">Elementary</p>
              <h3>Worship Center, Then Kids Hall</h3>
              <p>Kids begin together, then split into K-2nd and 3rd-5th with small-group time at the end.</p>
            </article>
          </div>
        </div>
      </SectionShell>

      <SectionShell>
        <SectionHeading
          eyebrow="Family care"
          title="There is a Nursing Moms Room for Families with Little Ones."
          description="Room 210 is available as a private room where parents can watch the live stream during service."
        />

        <div className="resource-grid">
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">Room 210</p>
            <h3>Nursing Moms Room</h3>
            <p>This is a private room where you can enjoy a live stream of each service with your little one.</p>
          </article>
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">Pickup</p>
            <h3>Emmanuel Kids Wing</h3>
            <p>All children may be picked up in the Emmanuel Kids Wing after ministry programming ends.</p>
          </article>
          <article className="resource-card">
            <p className="eyebrow eyebrow--small">Next step</p>
            <h3>See the Preschool Page</h3>
            <p>Families with younger children can also review Emmanuel Preschool for ages 3-5.</p>
            <Link className="resource-card__action" href="/connect/emmanuel-preschool">
              <ArrowRightIcon className="icon icon--xs" />
              <span>Open preschool page</span>
            </Link>
          </article>
        </div>
      </SectionShell>

      <a
        className="kids-fab"
        href={kidsVisitorFormUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Open the Emmanuel Kids visitor form"
      >
        <span>Visitor Form</span>
        <ArrowRightIcon className="icon icon--xs" />
      </a>
    </>
  );
}
