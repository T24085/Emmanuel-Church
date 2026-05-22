import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
    external?: boolean;
  };
  actionDetail?: ReactNode;
  media?: ReactNode;
};

export function PageHero({ eyebrow, title, description, action, actionDetail, media }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className={`site-shell page-hero__inner${media ? " page-hero__inner--media" : ""}`}>
        <div className="page-hero__layout">
          <div className="page-hero__content">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {media ? <div className="page-hero__media">{media}</div> : null}
        </div>
        {action ? (
          <div className="page-hero__actions">
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
