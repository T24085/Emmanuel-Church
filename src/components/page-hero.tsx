import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "./icons";
import { withBasePath } from "@/lib/site-path";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  mediaLayout?: "split" | "full";
  fullBleed?: boolean;
  layoutClassName?: string;
  action?: {
    label: string;
    href: string;
    external?: boolean;
  };
  actionDetail?: ReactNode;
  media?: ReactNode;
  heroImage?: {
    src: string;
    alt: string;
    position?: string;
  };
};

export function PageHero({
  eyebrow,
  title,
  description,
  mediaLayout = "split",
  fullBleed = false,
  layoutClassName,
  action,
  actionDetail,
  media,
  heroImage,
}: PageHeroProps) {
  const imageMedia = heroImage ? (
    <div className="page-hero__media-frame">
      <Image
        src={withBasePath(heroImage.src)}
        alt={heroImage.alt}
        fill
        priority
        sizes="(max-width: 760px) 100vw, (max-width: 1080px) 92vw, 74vw"
        className="page-hero__media-image"
        style={{ objectPosition: heroImage.position ?? "center center" }}
      />
    </div>
  ) : null;
  const resolvedMedia = media ?? imageMedia;
  const hasMedia = Boolean(resolvedMedia);
  const isFullBleedMedia = hasMedia && mediaLayout === "full";
  const isEdgeToEdge = isFullBleedMedia && fullBleed;

  return (
    <section
      className={`page-hero${isFullBleedMedia ? " page-hero--media-full" : ""}${
        isEdgeToEdge ? " page-hero--edge-to-edge" : ""
      }`}
    >
      <div
        className={`site-shell page-hero__inner${
          hasMedia ? " page-hero__inner--media" : ""
        }${isFullBleedMedia ? " page-hero__inner--media-full" : ""}${
          isEdgeToEdge ? " page-hero__inner--edge-to-edge" : ""
        }`}
      >
        <div
          className={`page-hero__layout${
            isFullBleedMedia ? " page-hero__layout--media-full" : ""
          }${layoutClassName ? ` ${layoutClassName}` : ""}`}
        >
          <div
            className={`page-hero__content${
              isFullBleedMedia ? " page-hero__content--media-full" : ""
            }`}
          >
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {resolvedMedia ? (
            <div
              className={`page-hero__media${
                isFullBleedMedia ? " page-hero__media--full" : ""
              }`}
            >
              {resolvedMedia}
            </div>
          ) : null}
        </div>
        {action ? (
          <div className={`page-hero__actions${isFullBleedMedia ? " page-hero__actions--full" : ""}`}>
            <Link
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noreferrer" : undefined}
              className="section-heading__action page-hero__action"
            >
              <span>{action.label}</span>
              <ArrowRightIcon className="icon icon--sm" />
            </Link>
            {actionDetail ? <div className="page-hero__action-detail">{actionDetail}</div> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
