import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { SectionHeading, SectionShell } from "@/components/section";

const resources = [
  {
    eyebrow: "Weekly",
    title: "Bulletins",
    description: "Find current and archived Sunday bulletins in one place.",
    href: "/resources/bulletin",
    label: "Open bulletins",
  },
  {
    eyebrow: "Study",
    title: "Weekly Sermon Study Guides",
    description: "Continue the message through notes, questions, and downloadable study material.",
    href: "/resources/weekly-sermon-study-guides",
    label: "Open study guides",
  },
  {
    eyebrow: "Connect",
    title: "Online Forms",
    description: "Submit church, event, scholarship, technology, and care requests online.",
    href: "/resources/online-forms",
    label: "View online forms",
  },
  {
    eyebrow: "Serve",
    title: "Spiritual Gifts & Serve",
    description: "Discover your spiritual gifts and find a meaningful way to serve at Emmanuel.",
    href: "/resources/spiritual-gifts-serve-booklet",
    label: "Explore serving",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Helpful Next Steps for Church Life."
        description="Find the documents, guides, and forms that help you stay connected to Emmanuel Church throughout the week."
      />

      <SectionShell>
        <SectionHeading
          eyebrow="Church resources"
          title="Stay Informed. Keep Growing. Get Connected."
          description="Choose a resource below to find the latest church materials or submit a request online."
        />
        <div className="resource-grid">
          {resources.map((resource) => (
            <article className="resource-card" key={resource.href}>
              <p className="eyebrow eyebrow--small">{resource.eyebrow}</p>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <Link className="resource-card__action" href={resource.href}>
                <ArrowRightIcon className="icon icon--xs" />
                <span>{resource.label}</span>
              </Link>
            </article>
          ))}
        </div>
      </SectionShell>
    </>
  );
}
