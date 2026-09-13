import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

type SectionHeadingProps = {
  as?: "h1" | "h2";
  eyebrow?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
    external?: boolean;
  };
};

export function SectionHeading({
  as: Heading = "h2",
  eyebrow,
  title,
  description,
  action,
}: SectionHeadingProps) {
  const actionNode = action ? (
    <Link
      href={action.href}
      target={action.external ? "_blank" : undefined}
      rel={action.external ? "noreferrer" : undefined}
      className="section-heading__action"
    >
      <span>{action.label}</span>
      <ArrowRightIcon className="icon icon--sm" />
    </Link>
  ) : null;

  return (
    <div className="section-heading">
      <div className="section-heading__copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <Heading>{title}</Heading>
        {description ? <p className="section-heading__description">{description}</p> : null}
      </div>
      {actionNode}
    </div>
  );
}

type SectionShellProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function SectionShell({ children, className = "", id }: SectionShellProps) {
  return (
    <section id={id} className={`section-shell ${className}`.trim()}>
      <div className="site-shell">{children}</div>
    </section>
  );
}
