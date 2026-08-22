import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { SectionHeading, SectionShell } from "@/components/section";
import { ministryLinks } from "@/data/site";
import churchMinistriesImage from "../../../Who we are - ABOUT/Church Ministries.png";
import adultDiscipleshipCardImage from "../../../images/adult-discipleship-card.png";
import blastCardImage from "../../../images/blast-card.png";
import preschoolCardImage from "../../../images/emmanuel-preschool-card.png";
import kidsCardImage from "../../../Emmanuel Preschool/Emmanuel Kids/58ce1398-acdc-4270-912f-46a1ab136586.png";
import momentumYouthCardImage from "../../../images/momentum-youth-card.png";
import worshipArtsCardImage from "../../../images/worship-arts-card.png";

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
        fullBleed
        action={{ label: "Plan Your Visit", href: "/contact" }}
        media={
          <div className="page-hero__media-frame">
            <Image
              src={churchMinistriesImage}
              alt="Jesus with a gathered ministry group"
              fill
              priority
              sizes="(max-width: 1080px) 100vw, 42vw"
              className="page-hero__media-image page-hero__media-image--connect"
            />
          </div>
        }
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
