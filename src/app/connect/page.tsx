import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { SectionHeading, SectionShell } from "@/components/section";
import { ministryLinks } from "@/data/site";
import { withBasePath } from "@/lib/site-path";

const adultDiscipleshipCardImage = withBasePath("/images/ministry-cards/adult-discipleship-card.png");
const blastCardImage = withBasePath("/images/ministry-cards/blast-card.png");
const preschoolCardImage = withBasePath("/images/ministry-cards/emmanuel-preschool-card.png");
const kidsCardImage = withBasePath("/images/ministry-cards/emmanuel-kids-card.png");
const momentumYouthCardImage = withBasePath("/images/ministry-cards/momentum-youth-card.png");
const worshipArtsCardImage = withBasePath("/images/ministry-cards/worship-arts-card.png");

const ministryCardImages = {
  "/connect/emmanuel-preschool": { src: preschoolCardImage, fit: "contain" },
  "/connect/emmanuel-kids": { src: kidsCardImage, fit: "contain" },
  "/connect/momentum-youth": { src: momentumYouthCardImage, fit: "contain" },
  "/connect/adult-discipleship-groups": { src: adultDiscipleshipCardImage, fit: "cover" },
  "/connect/wednesday-night-blast": { src: blastCardImage, fit: "contain" },
  "/connect/worship-arts-ministry": { src: worshipArtsCardImage, fit: "contain" },
} as const;

export default function ConnectPage() {
  return (
    <>
      <PageHero
        eyebrow="Connect"
        title="The Places Where Church Life Happens."
        description="From preschool through adult discipleship, Emmanuel's ministries give people a place to belong and a path to grow."
        mediaLayout="full"
        action={{ label: "Plan Your Visit", href: "/contact" }}
        heroImage={{
          src: "/images/heroes/connect-arrival.jpg",
          alt: "A family arriving at Emmanuel Church",
          position: "center 62%",
        }}
      />

      <SectionShell>
        <SectionHeading
          eyebrow="Ministry map"
          title="Clear Pathways for Every Age and Stage."
          description="Children, students, adults, worship, and midweek gatherings — each with a clear place to belong."
        />

        <div className="resource-grid ministry-map-grid">
          {ministryLinks.map((item) => {
            const image = ministryCardImages[item.href as keyof typeof ministryCardImages];

            return (
              <Link
                className="resource-card resource-card--linked ministry-card"
                href={item.href}
                key={item.href}
              >
                <div className={`ministry-card__media ministry-card__media--${image.fit}`}>
                  <Image
                    src={image.src}
                    alt={`${item.label} ministry artwork`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1080px) 50vw, 33vw"
                    className="ministry-card__image"
                  />
                </div>
                <div className="ministry-card__content">
                  <p className="eyebrow eyebrow--small">Ministry</p>
                  <h3>{item.label}</h3>
                  <p>{item.description}</p>
                  <span className="resource-card__action">
                    <span>Open page</span>
                    <ArrowRightIcon className="icon icon--xs" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </SectionShell>
    </>
  );
}
