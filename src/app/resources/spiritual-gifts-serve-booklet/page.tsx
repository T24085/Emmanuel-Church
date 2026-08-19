import Image from "next/image";
import { ArrowRightIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { ResourceTabs } from "@/components/resource-tabs";
import { SectionHeading, SectionShell } from "@/components/section";
import { spiritualGiftResources, spiritualGiftTeaching } from "@/data/spiritual-gifts";
import { withBasePath } from "@/lib/site-path";

export default function SpiritualGiftsServeBookletPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Discover Your Place to Serve."
        description="Learn how God has gifted you, then find a meaningful next step in the life and ministries of Emmanuel Church."
      />

      <ResourceTabs active="spiritual-gifts" />

      <SectionShell>
        <SectionHeading
          eyebrow="Spiritual gifts"
          title="From Discovery to Action."
          description="Begin with the inventory, then use the Serve Booklet to connect your gifts with the ministries and people God is building at Emmanuel."
        />

        <div className="spiritual-gifts-grid">
          {spiritualGiftResources.map((resource) => (
            <a
              className="spiritual-gift-card"
              href={resource.href}
              key={resource.href}
              target="_blank"
              rel="noreferrer"
            >
              <div className="spiritual-gift-card__media">
                <Image
                  src={withBasePath(resource.image)}
                  alt={`${resource.title} cover`}
                  width={800}
                  height={800}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="spiritual-gift-card__body">
                <p className="eyebrow eyebrow--small">{resource.eyebrow}</p>
                <h2>{resource.title}</h2>
                <p>{resource.description}</p>
                <span className="spiritual-gift-card__action">
                  {resource.actionLabel}
                  <ArrowRightIcon className="icon icon--xs" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="section-shell--tight">
        <div className="spiritual-gifts-story">
          <div className="spiritual-gifts-story__heading">
            <p className="eyebrow">Why serve?</p>
            <h2>Your Gifts Are Meant to Build Up the Church.</h2>
          </div>
          <div className="spiritual-gifts-story__copy">
            {spiritualGiftTeaching.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </SectionShell>
    </>
  );
}
